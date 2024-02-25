import { Match, Switch } from "solid-js";

import { generateAvatarUrl, jidToPhoneNumber } from "@/lib/utils";

import { useAvatar } from "@/services/sender";

import { Sender } from "@/models/sender";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { STATUS } from "./constant";

interface SenderInfoProps {
  sender?: Sender;
  status: () => string;
}

function SenderInfo(props: SenderInfoProps) {
  const avatar = useAvatar({
    get token() {
      return props.sender?.token || "";
    },
    get jid() {
      return props.sender?.jid || "";
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sender Info</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3}>
                <img
                  src={
                    avatar.data?.url ||
                    generateAvatarUrl({
                      name: props.sender?.jid || "foo",
                      style: "big-smile",
                      backgroundColors: ["#d6e6ff", "#d7f9f8", "#ffffea", "#fff0d4", "#fbe0e0", "#e5d4ef"],
                    })
                  }
                  alt="Avatar"
                  class="w-32 h-32 rounded-full"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="w-[1%] whitespace-nowrap">Name</TableCell>
              <TableCell class="w-[1%] whitespace-nowrap">:</TableCell>
              <TableCell>{props.sender?.name || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="w-[1%] whitespace-nowrap">Phone</TableCell>
              <TableCell class="w-[1%] whitespace-nowrap">:</TableCell>
              <TableCell>{props.sender?.jid ? jidToPhoneNumber(props.sender?.jid) : "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="w-[1%] whitespace-nowrap">Token</TableCell>
              <TableCell class="w-[1%] whitespace-nowrap">:</TableCell>
              <TableCell>{props.sender?.token || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="w-[1%] whitespace-nowrap">JID</TableCell>
              <TableCell class="w-[1%] whitespace-nowrap">:</TableCell>
              <TableCell>{props.sender?.jid || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="w-[1%] whitespace-nowrap">Status</TableCell>
              <TableCell class="w-[1%] whitespace-nowrap">:</TableCell>
              <TableCell>
                <Switch fallback={<Badge variant="secondary">{props.status()}</Badge>}>
                  <Match when={props.status() === STATUS.CONNECTED}>
                    <Badge variant="default">{props.status()}</Badge>
                  </Match>
                  <Match
                    when={
                      props.status() === STATUS.COULD_NOT_CONNECT ||
                      props.status() === STATUS.NOT_CONNECTED ||
                      props.status() === STATUS.TIMEOUT ||
                      props.status() === STATUS.BAD_AUTHENTICATION
                    }>
                    <Badge variant="destructive">{props.status()}</Badge>
                  </Match>
                </Switch>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface QRCodeProps {
  qrcode?: string;
}

function QRCode(props: QRCodeProps) {
  return (
    <Card>
      <CardContent class="mt-6 flex flex-col items-center gap-8">
        <img src={props.qrcode || ""} alt="QR Code" class="w-64 h-64" />
      </CardContent>
    </Card>
  );
}

export default {
  QRCode: QRCode,
  SenderInfo: SenderInfo,
};
