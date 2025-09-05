import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Star, Upload, X, MessageSquare, Calendar, User } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { Link } from 'react-router-dom'

interface Review {
  id: string
  user_id: string
  monastery_id: string
  rating: number
  comment: string
  photos: string[]
  created_at: string
}

interface ReviewSystemProps {
  monasteryId: string
}

const ReviewSystem = ({ monasteryId }: ReviewSystemProps) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Review form state
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [photos, setPhotos] = useState<File[]>([])

  useEffect(() => {
    fetchReviews()
  }, [monasteryId])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('monastery_id', monasteryId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${user?.id}/${Date.now()}-${file.name}`
      
      const { data, error } = await supabase.storage
        .from('review-photos')
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('review-photos')
        .getPublicUrl(fileName)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading photo:', error)
      return null
    }
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review.",
        variant: "destructive"
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload photos
      const photoUrls: string[] = []
      for (const photo of photos) {
        const url = await uploadPhoto(photo)
        if (url) photoUrls.push(url)
      }

      // Submit review
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          monastery_id: monasteryId,
          rating,
          comment: comment.trim() || null,
          photos: photoUrls
        })

      if (error) throw error

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      })

      // Reset form
      setRating(0)
      setComment('')
      setPhotos([])
      setShowReviewDialog(false)
      
      // Refresh reviews
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPhotos(prev => [...prev, ...files].slice(0, 3)) // Max 3 photos
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'fill-monastery-gold text-monastery-gold' 
                : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:text-monastery-gold' : ''}`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    )
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reviews & Feedback</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {renderStars(averageRating)}
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        
        {user ? (
          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  {renderStars(rating, true, setRating)}
                </div>
                
                <div>
                  <Label htmlFor="comment">Comment (optional)</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="photos">Photos (optional, max 3)</Label>
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                  
                  {photos.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Photo ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmitReview} 
                    disabled={isSubmitting || rating === 0}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReviewDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Link to="/auth">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Sign in to Review
            </Button>
          </Link>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No reviews yet. Be the first to share your experience!
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="monastery-card">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="bg-primary">
                        <AvatarFallback>
                          <User className="h-4 w-4 text-primary-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          Anonymous User
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Content */}
                  {review.comment && (
                    <p className="text-muted-foreground">{review.comment}</p>
                  )}

                  {/* Review Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewSystem