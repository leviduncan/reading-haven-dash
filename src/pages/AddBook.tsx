
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createBook } from "@/services/bookService";
import { BookStatus } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AddBook = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    pageCount: "",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww",
    status: "want-to-read" as BookStatus
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as BookStatus }));
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
        toast({
          title: "Book added",
          description: "Your book has been added to your collection"
        });
        navigate(`/book/${newBook.id}`);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive"
      });
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
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="coverImage"
                  name="coverImage"
                  type="url"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the URL of a book cover image. A default cover will be used if none is provided.
              </p>
              
              {formData.coverImage && (
                <div className="mt-3 relative w-full max-w-[150px] h-48 border rounded-md overflow-hidden">
                  <img 
                    src={formData.coverImage}
                    alt="Book cover preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww";
                    }}
                  />
                </div>
              )}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Book"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
