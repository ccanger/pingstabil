import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddServerFormProps {
  onAdd: (name: string, url: string) => void;
}

const AddServerForm = ({ onAdd }: AddServerFormProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      onAdd(name.trim(), url.trim());
      setName("");
      setUrl("");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Server
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="server-name">Server Name</Label>
            <Input
              id="server-name"
              placeholder="e.g., Google DNS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="server-url">URL/Address</Label>
            <Input
              id="server-url"
              placeholder="e.g., https://8.8.8.8 or https://google.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Server
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddServerForm;