import { createForm, zodForm } from "@modular-forms/solid";
import { TbLoader } from "solid-icons/tb";
import { Show } from "solid-js";

import { CreateUser, User, createUserSchema } from "@/models/user";

import { Button } from "@/components/ui/button";
import { Grid } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditUserFormProps {
  user: User;
  onSubmit: (user: CreateUser) => void;
}

function EditUserForm(props: EditUserFormProps) {
  console.log(props.user);
  const [createUserForm, { Form, Field }] = createForm<CreateUser>({
    validate: zodForm(createUserSchema),
    initialValues: {
      name: props.user.name,
      username: props.user.username,
      password: "12345678",
      whatsapp: props.user.whatsapp,
      email: props.user.email,
    },
  });

  function handleSubmit(user: CreateUser) {
    props.onSubmit(user);
  }

  return (
    <div class="grid gap-6">
      <Form onSubmit={handleSubmit}>
        <Grid class="gap-4">
          <Field name="name">
            {(field, props) => (
              <Grid class="gap-1">
                <Label for={field.name}>Name</Label>
                <Input {...props} type="text" id={field.name} value={field.value} />
                <Show when={field.error}>
                  <p class="text-destructive text-xs">{field.error}</p>
                </Show>
              </Grid>
            )}
          </Field>
          <Field name="username">
            {(field, props) => (
              <Grid class="gap-1">
                <Label for={field.name}>Username</Label>
                <Input {...props} type="username" id={field.name} value={field.value} />
                <Show when={field.error}>
                  <p class="text-destructive text-xs">{field.error}</p>
                </Show>
              </Grid>
            )}
          </Field>
          <Field name="whatsapp">
            {(field, props) => (
              <Grid class="gap-1">
                <Label for={field.name}>Whatsapp</Label>
                <Input {...props} type="whatsapp" id={field.name} value={field.value || ""} />
                <Show when={field.error}>
                  <p class="text-destructive text-xs">{field.error}</p>
                </Show>
              </Grid>
            )}
          </Field>
          <Field name="email">
            {(field, props) => (
              <Grid class="gap-1">
                <Label for={field.name}>Email</Label>
                <Input {...props} type="email" id={field.name} value={field.value || ""} />
                <Show when={field.error}>
                  <p class="text-destructive text-xs">{field.error}</p>
                </Show>
              </Grid>
            )}
          </Field>
          <Button type="submit" disabled={createUserForm.submitting} class="mt-8">
            <Show when={createUserForm.submitting}>
              <TbLoader class="mr-2 h-4 w-4 animate-spin" />
            </Show>
            Submit
          </Button>
        </Grid>
      </Form>
    </div>
  );
}

export default EditUserForm;
