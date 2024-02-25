import { As } from "@kobalte/core";
import { useQueryClient } from "@tanstack/solid-query";
import { TbPlus } from "solid-icons/tb";
import { createSignal } from "solid-js";

import { createSenderMutation, deleteSenderMutation, updateSenderMutation } from "@/services/sender";

import { CreateSender, Sender } from "@/models/sender";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreateSenderForm from "./form/create";
import EditSenderForm from "./form/edit";

function DialogCreateSenderForm() {
  const queryClient = useQueryClient();
  const createSender = createSenderMutation();

  const [open, setOpen] = createSignal(false);

  function handleSubmit(sender: CreateSender) {
    createSender.mutate(sender, {
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["sender"],
        });
      },
    });
  }

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button}>
        <TbPlus class="w-5 h-5  mr-2" />
        Create
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Sender</DialogTitle>
          <DialogDescription>Enter sender details below.</DialogDescription>
        </DialogHeader>
        <CreateSenderForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

interface DialogEditSenderFormProps {
  sender: Sender;
}

function DialogEditSenderForm(props: DialogEditSenderFormProps) {
  const queryClient = useQueryClient();
  const editSender = updateSenderMutation();

  const [open, setOpen] = createSignal(false);

  function handleSubmit(sender: CreateSender) {
    let payload = {
      id: props.sender.id,
      ...sender,
    };
    editSender.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["sender"],
        });
      },
    });
  }

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <As component={Button} variant="outline">
          Edit
        </As>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Sender</DialogTitle>
          <DialogDescription>Enter sender details below.</DialogDescription>
        </DialogHeader>
        <EditSenderForm onSubmit={handleSubmit} sender={props.sender} />
      </DialogContent>
    </Dialog>
  );
}

interface DialogDeleteSenderFormProps {
  sender: Sender;
}

function DialogDeleteSenderForm(props: DialogDeleteSenderFormProps) {
  const queryClient = useQueryClient();
  const deleteSender = deleteSenderMutation();

  const [open, setOpen] = createSignal(false);

  function handleDelete() {
    deleteSender.mutate(props.sender.id || 0, {
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["sender"],
        });
      },
    });
  }

  return (
    <AlertDialog open={open()} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <As component={Button} variant="destructive">
          Delete
        </As>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          You are about to delete <span class="font-medium">"{props.sender.name}"</span> sender. This action cannot be
          undone.
        </AlertDialogDescription>
        <div class="flex justify-end gap-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default {
  CreateSenderForm: DialogCreateSenderForm,
  EditSenderForm: DialogEditSenderForm,
  DeleteSenderForm: DialogDeleteSenderForm,
};
