import { As } from "@kobalte/core";
import { useQueryClient } from "@tanstack/solid-query";
import { TbPlus } from "solid-icons/tb";
import { createSignal } from "solid-js";

import { createUserMutation, deleteUserMutation, updateUserMutation } from "@/services/user";

import { CreateUser, User } from "@/models/user";

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

import CreateUserForm from "./form/create";
import EditUserForm from "./form/edit";

function DialogCreateUserForm() {
  const createUser = createUserMutation();

  const [open, setOpen] = createSignal(false);

  function handleSubmit(user: CreateUser) {
    createUser.mutate(user, {
      onSuccess: () => {
        setOpen(false);
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
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>Enter user details below.</DialogDescription>
        </DialogHeader>
        <CreateUserForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

interface DialogEditUserFormProps {
  user: User;
}

function DialogEditUserForm(props: DialogEditUserFormProps) {
  const editUser = updateUserMutation();

  const [open, setOpen] = createSignal(false);

  function handleSubmit(user: CreateUser) {
    let payload = {
      id: props.user.id || 0,
      user,
    };
    editUser.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
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
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Enter user details below.</DialogDescription>
        </DialogHeader>
        <EditUserForm onSubmit={handleSubmit} user={props.user} />
      </DialogContent>
    </Dialog>
  );
}

interface DialogDeleteUserFormProps {
  user: User;
}

function DialogDeleteUserForm(props: DialogDeleteUserFormProps) {
  const queryClient = useQueryClient();
  const deleteUser = deleteUserMutation();

  const [open, setOpen] = createSignal(false);

  function handleDelete() {
    deleteUser.mutate(props.user.id || 0, {
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["user"],
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
          You are about to delete <span class="font-medium">"{props.user.name}"</span> user. This action cannot be
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
  CreateUserForm: DialogCreateUserForm,
  EditUserForm: DialogEditUserForm,
  DeleteUserForm: DialogDeleteUserForm,
};
