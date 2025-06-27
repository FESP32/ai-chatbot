'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CustomGPT } from '@/lib/db/schema';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { useRouter } from 'next/navigation';

export default function GPTForm({ gpt }: { gpt?: CustomGPT }) {

  const router = useRouter();

  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    instructions: '',
    image: '',
    model: DEFAULT_CHAT_MODEL,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModelChange = (value: string) => {
    setForm((prev) => ({ ...prev, model: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (gpt) {
        form.id = gpt.id;
      }

      const res = await fetch('/api/gpts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to create GPT agent');

      await res.json();
      toast({
        type: 'success',
        description: `Success ${gpt ? 'Updating' : 'Creating'} Custom GPT!`,
      });
      
      router.push('/gpts');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        type: 'error',
        description: `Error ${gpt ? 'Updating' : 'Creating'} Custom GPT!`,
      });
    }
  };

  useEffect(() => {
    if (gpt) {
      setForm({
        id: gpt.id,
        name: gpt.name,
        description: gpt.description,
        instructions: gpt.instructions,
        image: gpt.image,
        model: gpt.model,
      });
    }
  }, [gpt]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 rounded-xl w-full max-w-2xl mx-auto shadow"
    >
      <h2 className="text-3xl font-bold">Configure {form.name || 'Assisstant'}</h2>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Name your GPT"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add a short description about what this GPT does"
          value={form.description}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          name="instructions"
          placeholder="What does this GPT do? How does it behave? What should it avoid doing?"
          value={form.instructions}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          name="image"
          placeholder="e.g., https://picsum.photos/200"
          value={form.image}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Model</Label>
        <Select value={form.model} onValueChange={handleModelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DEFAULT_CHAT_MODEL}>
              {DEFAULT_CHAT_MODEL}
            </SelectItem>
            <SelectItem value="chat-model-reasoning">
              chat-model-reasoning
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {gpt ? 'Update' : 'Create'} Agent
      </Button>
    </form>
  );
}
