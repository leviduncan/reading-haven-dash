
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createBook } from "@/services/bookService";
import { BookStatus } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AddBook = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    pageCount: "",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww",
    status: "want-to-read" as BookStatus
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as BookStatus }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Image preview
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    try {
      setIsUploading(true);
      
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('book-covers')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath);
      
      if (publicUrlData) {
        setFormData(prev => ({ ...prev, coverImage: publicUrlData.publicUrl }));
      }
      
      toast({
        title: "Image uploaded",
        description: "Book cover image uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload cover image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({ 
      ...prev, 
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww" 
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      const book = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        genre: formData.genre,
        pageCount: parseInt(formData.pageCount),
        coverImage: formData.coverImage,
        status: formData.status,
        isFavorite: false
      };
      
      const newBook = await createBook(book, user.id);
      
      if (newBook) {
        navigate(`/book/${newBook.id}`);
      }
    } catch (error) {
      console.error("Error adding book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
              />
            </div>
            
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Enter author name"
              />
            </div>
            
            <div>
              <Label htmlFor="genre">Genre *</Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                placeholder="Fiction, Fantasy, Mystery, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="pageCount">Number of Pages *</Label>
              <Input
                id="pageCount"
                name="pageCount"
                type="number"
                min="1"
                value={formData.pageCount}
                onChange={handleChange}
                required
                placeholder="Enter page count"
              />
            </div>
            
            <div>
              <Label htmlFor="coverImage">Cover Image</Label>
              <div className="mt-2 flex flex-col items-center">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                <div 
                  className="relative w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={handleImageClick}
                >
                  {previewImage || formData.coverImage !== "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww" ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previewImage || formData.coverImage} 
                        alt="Book cover" 
                        className="w-full h-full object-contain"
                      />
                      <button 
                        type="button"
                        className="absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {isUploading ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="mt-2 text-sm">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload a cover image</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (max 5MB)</p>
                        </>
                      )}
                    </>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  A default cover will be used if none is provided
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Book Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter a description of the book"
                className="h-32"
              />
            </div>
            
            <div className="pt-4">
              <Label>Reading Status *</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={handleStatusChange}
                className="mt-3 space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="want-to-read" id="want-to-read" />
                  <Label htmlFor="want-to-read" className="cursor-pointer">Want to Read</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="currently-reading" id="currently-reading" />
                  <Label htmlFor="currently-reading" className="cursor-pointer">Currently Reading</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed" className="cursor-pointer">Completed</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Adding..." : "Add Book"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
