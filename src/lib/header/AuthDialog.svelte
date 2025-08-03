<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { page } from "$app/state";
  import { LogOut, Mail, MailCheck, MailX } from "@lucide/svelte";

  let { user } = $props();
  const isLoggedIn = $derived(!user);
  let email = $state("");
  let success = $state(null);
  let errorMessage = $state("");

  async function login() {
    const res = await fetch("/en/auth/login?redirectTo=" + page.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    let { success: responseSuccess, error: responseError } = await res.json();
    success = responseSuccess;
    errorMessage = responseError;
  }

  async function logout() {
    const res = await fetch("/en/auth/logout", { method: "POST" });
    const data = await res.json();

    if (data.success) {
      location.reload();
    } else {
      console.error("Logout error:", data.error);
    }
  }

  function onClose() {
    email = "";
    success = null;
    errorMessage = "";
  }
</script>

<Popover.Content onInteractOutside={onClose} class="w-[340px] px-6 py-4 text-sm">
  {#if isLoggedIn}
    {#if success === null}
      <h2 class="text-lg font-semibold text-center">Willkommen!</h2>

      <div class="mt-4 space-y-4">
        <div class="space-y-2">
          <Label for="email">Email-Adresse</Label>
          <Input id="email" name="email" type="email" bind:value={email} placeholder="you@example.com" required />
          {#if errorMessage}
            <p class="text-muted-foreground text-sm text-red-500">{errorMessage}</p>
          {/if}
        </div>

        <Button class="w-full gap-2" onclick={login}>
          <Mail class="w-4 h-4" /> Login Link senden
        </Button>
      </div>

    {:else if success === true}
      <div class="flex flex-col items-center text-center space-y-3">
        <MailCheck class="h-8 w-8 text-green-600" />
        <h2 class="text-lg font-semibold">An email is on its way!</h2>
        <p class="">
          We sent a login link to your email <strong>{email}</strong>.<br />
          The link expires in 1 hour, so be sure to use it soon.
        </p>
      </div>

    {:else}
      <div class="flex flex-col items-center text-center space-y-3">
        <MailX class="h-8 w-8 text-red-500" />
        <h2 class="text-lg font-semibold">Etwas ist schiefgelaufen</h2>
        <p class="text-muted-foreground text-sm">{errorMessage}</p>
        <Button class="mt-2" onclick={() => { 
          success = null;
          errorMessage = "";
         }}>
          Erneut versuchen
        </Button>
      </div>
    {/if}

  {:else}
    <div class="text-center space-y-4">
      <h2 class="text-lg font-semibold">Willkommen zurück!</h2>
      <p class="text-sm text-muted-foreground">Eingeloggt als<br /><strong>{user?.email}</strong></p>
      <Button class="w-full gap-2 bg-red-500 hover:bg-red-600 text-white" onclick={logout}>
        <LogOut class="w-4 h-4" /> Logout
      </Button>
    </div>
  {/if}
</Popover.Content>
