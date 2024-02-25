import { useParams } from "@solidjs/router";
import { RiSystemRefreshLine } from "solid-icons/ri";
import { TbLoader } from "solid-icons/tb";
import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";

import { connect, getContacts, getQR, statusRequest, useSenderDetail } from "@/services/sender";

import { Contact } from "@/models/sender";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Cards from "./components/cards";
import { STATUS } from "./components/constant";
import { TableDetail, columns, createContactsTable } from "./components/data-table";

function SenderDetailPage() {
  const params = useParams();
  const sender = useSenderDetail(parseInt(params.id));
  const [token, setToken] = createSignal<string>("");
  const [scanInterval, setScanInterval] = createSignal<NodeJS.Timeout | null>(null);
  const [scanned, setScanned] = createSignal<boolean>(false);
  const [qrcode, setQrcode] = createSignal<string>("");
  const [status, setStatus] = createSignal<string>("");
  const [contacts, setContacts] = createSignal<Contact[]>([]);

  const table = createContactsTable({
    get data() {
      return contacts();
    },
    get columns() {
      return columns(token());
    },
  });

  onCleanup(() => {
    if (scanInterval() !== null) {
      clearInterval(scanInterval()!);
      setScanInterval(null);
    }

    setScanned(false);
    setQrcode("");
    setStatus("");
    setToken("");
  });

  createEffect(() => {
    if (sender.data?.token) {
      setToken(sender.data?.token);
    }
  });

  createEffect(() => {
    if (status() === STATUS.CONNECTED) {
      getContacts(token() || "").then((data) => {
        if (data === null) {
          return;
        }
        const contacts: Contact[] = [];
        for (const [key, value] of Object.entries(data)) {
          contacts.push({
            jid: key,
            found: value.Found,
            firstName: value.FirstName,
            fullName: value.FullName,
            pushName: value.PushName,
            businessName: value.BusinessName,
          });
        }

        setContacts(contacts);
      });
    }
  });

  createEffect(() => {
    statusRequest(token() || "").then((status) => {
      if (!status) {
        setStatus(STATUS.NOT_CONNECTED);
        return;
      }

      if (status.success != true && status.success != false) {
        setStatus(STATUS.BAD_AUTHENTICATION);
        return;
      }

      const isSuccess = status.success;
      const isLoggedIn = status.data.logged_in;
      const isConnected = status.data.connected;

      // connected to whatsapp and logged in
      if (isSuccess && isLoggedIn && isConnected) {
        setStatus(STATUS.CONNECTED);
        setScanned(true);
        return;
      }

      // not connected to whatsapp and logged in
      if (isSuccess && isLoggedIn && !isConnected) {
        connect(token() || "").then(() => {
          setStatus(STATUS.CONNECTED);
        });
        setScanned(true);
        return;
      }

      // connected to whatsapp but not logged in
      if (isSuccess && !isLoggedIn && isConnected) {
        setStatus(STATUS.NOT_SCANNED);
        showQR();
        return;
      }

      // not connected to whatsapp and not logged in
      if (isSuccess && !isLoggedIn && !isConnected) {
        setStatus(STATUS.NOT_CONNECTED);
        connect(token() || "").then(() => {
          setStatus(STATUS.CONNECTED);
        });
        return;
      }

      // error
      if (!isSuccess) {
        switch (status.error) {
          case "no session": // this usually occurs when the its a first time login
            connect(token() || "").then((data) => {
              if (data.success === true) {
                showQR();
              } else {
                setStatus(STATUS.COULD_NOT_CONNECT);
              }
            });
            break;
          case "Unauthorized": // this usually occurs when the token is invalid
            setStatus(STATUS.BAD_AUTHENTICATION);
            break;
          default:
            setStatus(STATUS.NOT_CONNECTED);
            break;
        }

        return;
      }

      return;
    });
  });

  function checkStatus() {
    statusRequest(token() || "").then((status) => {
      if (!status) {
        setStatus(STATUS.NOT_CONNECTED);
        return;
      }

      const isSuccess = status.success;
      const isLoggedIn = status.data.logged_in;

      if (isSuccess != true || isSuccess != false) {
        setStatus(STATUS.BAD_AUTHENTICATION);
        return;
      }

      if (!isSuccess) {
        if (scanInterval() !== null) {
          clearInterval(scanInterval()!);
          setScanInterval(null);
        }
        setStatus(STATUS.NOT_CONNECTED);
        return;
      }

      if (isSuccess && isLoggedIn) {
        if (scanInterval() !== null) {
          clearInterval(scanInterval()!);
          setScanInterval(null);
        }
        setScanned(true);
        setStatus(STATUS.CONNECTED);
        return;
      }

      return;
    });
  }

  async function wait(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }

  async function showQR() {
    if (scanInterval() !== null) {
      clearInterval(scanInterval()!);
      setScanInterval(null);
    }
    setScanInterval(setInterval(checkStatus, 1000));
    setStatus(STATUS.SHOW_QR);
    while (!scanned()) {
      setStatus(STATUS.NOT_SCANNED);
      var data = await getQR(token() || "");
      if (!data === null) {
        setStatus(STATUS.NOT_CONNECTED);
        return;
      }

      if (!data.success) {
        if (scanInterval() !== null) {
          clearInterval(scanInterval()!);
          setScanInterval(null);
        }
        setScanned(true);
        setStatus(STATUS.TIMEOUT);
        return;
      }

      setQrcode(data.qrcode);
      if (data.qrcode != "") {
        await wait(15 * 1000); // wait 15 seconds
      }
    }
  }

  return (
    <div class="space-y-4 p-8 pt-6">
      <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">
          Sender Detail
          <Show when={sender.isFetching}>
            <TbLoader class="inline-flex ml-2 h-4 w-4 animate-spin" />
          </Show>
        </h2>
        <Button variant="outline" onClick={() => sender.refetch()}>
          <RiSystemRefreshLine
            class="w-5 h-5"
            classList={{
              "animate-spin": sender.isFetching,
            }}
          />
        </Button>
      </div>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-7 row-span-2">
          <Tabs defaultValue="contacts" class="space-y-4">
            <TabsList>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="send-message">Send Message</TabsTrigger>
            </TabsList>
            <TabsContent value="contacts" class="space-y-4">
              <div class="flex gap-x-4">
                <Input
                  placeholder="Filter name..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onInput={(event) => {
                    table.getColumn("name")?.setFilterValue(event.target.value);
                  }}
                  class="max-w-sm"
                />
                <div class="ml-auto flex gap-x-4">
                  <DataTable.ColumnVisibility table={table} />
                </div>
              </div>
              <DataTable.Root>
                <DataTable.Table table={table}>{(row) => <TableDetail contact={row.original} />}</DataTable.Table>
                <DataTable.Pagination table={table} />
              </DataTable.Root>
            </TabsContent>
            <TabsContent value="send-message" class="space-y-4">
              <Accordion multiple={false} collapsible class="w-full">
                <For
                  each={[
                    {
                      id: "send-text",
                      name: "Send Text",
                      content: <div>Send Text</div>,
                    },
                    {
                      id: "send-document",
                      name: "Send Document",
                      content: <div>Send Document</div>,
                    },
                    {
                      id: "send-audio",
                      name: "Send Audio",
                      content: <div>Send Audio</div>,
                    },
                    {
                      id: "send-image",
                      name: "Send Image",
                      content: <div>Send Image</div>,
                    },
                    {
                      id: "send-sticker",
                      name: "Send Sticker",
                      content: <div>Send Sticker</div>,
                    },
                    {
                      id: "send-video",
                      name: "Send Video",
                      content: <div>Send Video</div>,
                    },
                    {
                      id: "send-contact",
                      name: "Send Contact",
                      content: <div>Send Contact</div>,
                    },
                    {
                      id: "send-location",
                      name: "Send Location",
                      content: <div>Send Location</div>,
                    },
                    {
                      id: "send-button",
                      name: "Send Button",
                      content: <div>Send Button</div>,
                    },
                    {
                      id: "send-list",
                      name: "Send List",
                      content: <div>Send List</div>,
                    },
                  ]}>
                  {(item) => (
                    <AccordionItem value={item.id}>
                      <AccordionTrigger>{item.name}</AccordionTrigger>
                      <AccordionContent>{item.content}</AccordionContent>
                    </AccordionItem>
                  )}
                </For>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
        <div class="col-span-5">
          <Cards.SenderInfo sender={sender.data} status={status} />
        </div>
        <div class="col-span-5">
          <Show when={qrcode() !== ""}>
            <Cards.QRCode qrcode={qrcode()} />
          </Show>
        </div>
      </div>
    </div>
  );
}

export default SenderDetailPage;
