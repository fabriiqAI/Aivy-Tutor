"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadButton } from "@/components/knowledge/upload-button";
import { URLInput } from "@/components/knowledge/url-input";
import { Network, FileText, Link, BookOpen } from "lucide-react";

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <div className="flex gap-4">
            <UploadButton />
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        <Card className="p-4 mb-8">
          <URLInput />
        </Card>

        <div className="flex gap-4 mb-8">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge base..."
            className="max-w-md"
          />
          <Button>Search</Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="urls">URLs</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Network className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Knowledge Item {i}</h3>
                      <p className="text-sm text-muted-foreground">
                        Brief description of the knowledge item...
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}