import { A } from "@solidjs/router";
import { RiSystemRefreshLine } from "solid-icons/ri";
import { TbLoader } from "solid-icons/tb";
import { Show, onMount } from "solid-js";

import { useSender } from "@/services/sender";

import { Button, buttonVariants } from "@/components/ui/button";
import Datatable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";

import { TableDetail, columns, createSenderTable } from "./components/data-table";
import Dialog from "./components/dialog";

function SenderPage() {
  const sender = useSender();
  const table = createSenderTable({
    get data() {
      return sender.data || [];
    },
    columns,
  });

  onMount(() => {
    document.title = "Sender";
  });

  return (
    <div class="space-y-4 p-8 pt-6">
      <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">
          Sender
          <Show when={sender.isFetching}>
            <TbLoader class="inline-flex ml-2 h-4 w-4 animate-spin" />
          </Show>
        </h2>
      </div>
      <Datatable.Root>
        <div class="flex items-end gap-x-4">
          <Input
            placeholder="Filter name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onInput={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            class="max-w-sm"
          />
          <div class="ml-auto flex items-end gap-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                sender.refetch();
              }}>
              <RiSystemRefreshLine
                classList={{
                  "animate-spin": sender.isFetching,
                }}
              />
            </Button>
            <Datatable.ColumnVisibility table={table} />
            <Dialog.CreateSenderForm />
          </div>
        </div>
        <Datatable.Table table={table}>
          {(row) => (
            <TableDetail sender={row.original}>
              <A class={buttonVariants()} href={`/sender/${row.original.id}`}>
                Open
              </A>
              <Dialog.EditSenderForm sender={row.original} />
              <Dialog.DeleteSenderForm sender={row.original} />
            </TableDetail>
          )}
        </Datatable.Table>
        <Datatable.Pagination table={table} />
      </Datatable.Root>
    </div>
  );
}

export default SenderPage;
