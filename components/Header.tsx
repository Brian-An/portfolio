"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Header() {
  return (
    <div className="justify-around flex w-full max-w-3xl gap-4">
      <h1 className="text-lg">brian an</h1>
      <div className="flex gap-2">
        <Tabs defaultValue="about" className="w-full">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="about"></TabsContent>
          <TabsContent value="projects"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
