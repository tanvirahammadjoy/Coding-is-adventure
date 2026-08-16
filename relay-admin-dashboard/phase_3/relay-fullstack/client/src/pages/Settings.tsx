// ─────────────────────────────────────────────────────────────────────────
// Settings page — four tabs (General / Notifications / API & Webhooks /
// Billing). Each tab's content is fully static/uncontrolled here (no
// lifted state) since nothing on this page needs to react to another
// part of the app.
// ─────────────────────────────────────────────────────────────────────────

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/**
 * A single labeled row with a control on the right — the repeating pattern
 * used throughout the Notifications and API tabs (title, one-line
 * description, and a Switch). Kept local to this file since it's only
 * used here.
 */
function SettingsRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function Settings() {
  return (
    <div className="max-w-3xl">
      <Tabs defaultValue="general">
        <TabsList className="w-full justify-start overflow-x-auto border border-border bg-card sm:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API &amp; Webhooks</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* General: plain form fields, no validation wired up (prototype). */}
        <TabsContent value="general" className="mt-4 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" defaultValue="Relay Production" className="max-w-sm border-border bg-secondary/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="workspace-slug">Workspace URL</Label>
              <div className="flex max-w-sm items-center overflow-hidden rounded-md border border-border bg-secondary/50 text-sm">
                <span className="border-r border-border bg-secondary px-3 py-2 text-muted-foreground">relay.dev/</span>
                <input
                  id="workspace-slug"
                  defaultValue="acme-inc"
                  className="w-full bg-transparent px-3 py-2 text-foreground outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="timezone">Default timezone</Label>
              <Input id="timezone" defaultValue="UTC+08:00 — Kuching" className="max-w-sm border-border bg-secondary/50" />
            </div>
            <Separator className="my-1 bg-border" />
            <div className="flex justify-end">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications: each row is a SettingsRow + Switch, using
            defaultChecked rather than controlled state since nothing
            downstream needs to read these values in this prototype. */}
        <TabsContent value="notifications" className="mt-4 rounded-lg border border-border bg-card px-5">
          <div className="divide-y divide-border">
            <SettingsRow title="Incident alerts" description="Notify when error rate exceeds 2% for 5 minutes.">
              <Switch defaultChecked />
            </SettingsRow>
            <SettingsRow title="Deploy notifications" description="Post a message when a new version goes live.">
              <Switch defaultChecked />
            </SettingsRow>
            <SettingsRow title="Weekly digest" description="Summary of traffic, errors, and queue health every Monday.">
              <Switch />
            </SettingsRow>
            <SettingsRow title="Dead-letter queue warnings" description="Alert when a message fails retries and lands in DLQ.">
              <Switch defaultChecked />
            </SettingsRow>
          </div>
        </TabsContent>

        {/* API & Webhooks: same SettingsRow pattern, different subject matter. */}
        <TabsContent value="api" className="mt-4 rounded-lg border border-border bg-card px-5">
          <div className="divide-y divide-border">
            <SettingsRow title="Signing secret rotation" description="Rotate the webhook signing secret every 90 days.">
              <Switch defaultChecked />
            </SettingsRow>
            <SettingsRow title="Sandbox mode" description="Route all outbound webhooks to the sandbox endpoint.">
              <Switch />
            </SettingsRow>
            <SettingsRow title="Request logging" description="Retain full request and response bodies for 30 days.">
              <Switch defaultChecked />
            </SettingsRow>
          </div>
        </TabsContent>

        {/* Billing: single usage summary card + upgrade CTA. */}
        <TabsContent value="billing" className="mt-4 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-4">
            <div>
              <div className="text-sm font-medium text-foreground">Free tier</div>
              <div className="mt-0.5 text-xs text-muted-foreground">42,110 of 100,000 monthly events used</div>
            </div>
            <Button variant="outline" className="border-border">
              Upgrade plan
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
