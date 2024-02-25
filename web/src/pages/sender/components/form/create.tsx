import { createForm, zodForm } from "@modular-forms/solid";
import { TbLoader } from "solid-icons/tb";
import { Show } from "solid-js";

import { CreateSender, createSenderSchema } from "@/models/sender";

import { Button } from "@/components/ui/button";
import { Grid } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateSenderFormProps {
  onSubmit: (sender: CreateSender) => void;
}

function CreateSenderForm(props: CreateSenderFormProps) {
  const [createSenderForm, { Form, Field }] = createForm<CreateSender>({
    validate: zodForm(createSenderSchema),
  });

  function handleSubmit(sender: CreateSender) {
    props.onSubmit(sender);
  }

  return (
    <div class="grid gap-6">
      <Form onSubmit={handleSubmit}>
        <Grid class="gap-4">
          <Field name="name">
            {(field, props) => (
              <Grid class="gap-1">
                <Label for="name">Name</Label>
                <Input {...props} type="text" id="name" />
                <Show when={field.error}>
                  <p class="text-destructive text-xs">{field.error}</p>
                </Show>
              </Grid>
            )}
          </Field>
          <Field name="token">
            {(field, props) => (
              <Grid class="gap-1">
                <Label for="token">Token</Label>
                <Input {...props} type="token" id="token" />
                <Show when={field.error}>
                  <p class="text-destructive text-xs">{field.error}</p>
                </Show>
              </Grid>
            )}
          </Field>
          <Button type="submit" disabled={createSenderForm.submitting} class="mt-8">
            <Show when={createSenderForm.submitting}>
              <TbLoader class="mr-2 h-4 w-4 animate-spin" />
            </Show>
            Submit
          </Button>
        </Grid>
      </Form>
    </div>
  );
}

export default CreateSenderForm;
