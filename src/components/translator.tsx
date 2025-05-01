"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRightLeft, Languages, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { translateText } from "@/ai/flows/translate-text";
import type { TranslateTextInput } from "@/ai/flows/translate-text";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Japanese", label: "Japanese" },
  { value: "Chinese", label: "Chinese" },
  { value: "Russian", label: "Russian" },
  { value: "Italian", label: "Italian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Arabic", label: "Arabic" },
];

const FormSchema = z.object({
  text: z.string().min(1, {
    message: "Please enter text to translate.",
  }),
  sourceLanguage: z.string({
    required_error: "Please select a source language.",
  }),
  targetLanguage: z.string({
    required_error: "Please select a target language.",
  }),
}).refine(data => data.sourceLanguage !== data.targetLanguage, {
  message: "Source and target languages must be different.",
  path: ["targetLanguage"], // You can also put this on sourceLanguage or make it a form-level error
});


export function Translator() {
  const [translatedText, setTranslatedText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
      sourceLanguage: "English",
      targetLanguage: "Spanish",
    },
  });

 async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setTranslatedText(""); // Clear previous translation

    try {
      const input: TranslateTextInput = {
        text: data.text,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
      };
      const result = await translateText(input);
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: "Could not translate the text. Please try again.",
      });
       setTranslatedText(""); // Clear any potential partial result on error
    } finally {
      setIsLoading(false);
    }
  }

  function swapLanguages() {
    const currentSource = form.getValues("sourceLanguage");
    const currentTarget = form.getValues("targetLanguage");
    form.setValue("sourceLanguage", currentTarget);
    form.setValue("targetLanguage", currentSource);
    // Optionally swap text content as well
    const currentInputText = form.getValues("text");
    form.setValue("text", translatedText);
    setTranslatedText(currentInputText);

  }

  return (
    <Card className="w-full shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
           <Languages className="w-6 h-6 text-primary" /> Translate Text
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
               <FormField
                  control={form.control}
                  name="sourceLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={`source-${lang.value}`} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={swapLanguages}
                  className="mb-2 md:mb-0 self-center transition-transform hover:rotate-180 duration-300"
                  aria-label="Swap languages"
                >
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </Button>

               <FormField
                  control={form.control}
                  name="targetLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={`target-${lang.value}`} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>


            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text to Translate</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter text here..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full transition-all duration-200 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate"
              )}
            </Button>
          </form>
        </Form>

        {translatedText && (
          <div className="mt-6 space-y-2">
            <Label htmlFor="translated-text">Translated Text</Label>
             <Textarea
              id="translated-text"
              value={translatedText}
              readOnly
              className="resize-none min-h-[100px] bg-secondary/30 focus-visible:ring-0 focus-visible:ring-offset-0 border-muted"
              aria-live="polite"
            />
          </div>
        )}
         {!translatedText && isLoading && (
           <div className="mt-6 space-y-2">
            <Label>Translated Text</Label>
              <div className="p-3 min-h-[100px] rounded-md border border-input bg-secondary/30 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            </div>
         )}
      </CardContent>
    </Card>
  );
}

// Add Label component if it's not globally available
const Label = React.forwardRef<
  React.ElementRef<"label">,
  React.ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));
Label.displayName = "Label";

