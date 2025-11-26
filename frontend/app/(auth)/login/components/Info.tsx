"use client";

import Button from "@/components/Button";

interface InfoProps {
  name: string;
  setName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export default function Info({
  name,
  setName,
  onSubmit,
  isLoading,
  error,
}: InfoProps) {
  const isNameEmpty = !name.trim();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-black">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          disabled={isLoading}
          className="w-full rounded-lg border border-graytext px-4 py-3 text-[16px] text-black font-medium placeholder:text-graytext focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <Button 
        type="submit" 
        className={isLoading || isNameEmpty ? "bg-disabled" : ""} 
        disabled={isLoading || isNameEmpty}
      >
        {isLoading ? "Getting started..." : "Get started"}
      </Button>
    </form>
  );
}

