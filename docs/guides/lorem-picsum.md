# Lorem Picsum Documentation

Lorem Picsum is a powerful and free image placeholder service that provides high-quality random images for development and testing. This document outlines how to use Lorem Picsum in Pattern Bridge and its various features.

## Basic Usage

### Random Images
Get a random image with specific dimensions:
```
https://picsum.photos/{width}/{height}
```

Example:
```typescript
const imageUrl = "https://picsum.photos/500/300";  // 500px width, 300px height
```

### Square Images
For square images, just specify one dimension:
```
https://picsum.photos/{size}
```

Example:
```typescript
const squareImageUrl = "https://picsum.photos/300";  // 300x300px
```

## Advanced Features

### 1. Prevent Caching
To get unique random images and prevent caching, add a random parameter:
```typescript
const uniqueImageUrl = `https://picsum.photos/500/300?random=${Math.random()}`;
// Or with an index
const indexedImageUrl = `https://picsum.photos/500/300?random=${index}`;
```

### 2. Specific Images
Get a specific image using its ID:
```
https://picsum.photos/id/{imageId}/{width}/{height}
```

Example:
```typescript
const specificImageUrl = "https://picsum.photos/id/237/500/300";  // Dog image
```

### 3. Static Random Images
Get the same random image every time using a seed:
```
https://picsum.photos/seed/{seedText}/{width}/{height}
```

Example:
```typescript
const seededImageUrl = "https://picsum.photos/seed/pattern-bridge/500/300";
```

### 4. Image Effects

#### Grayscale
Add grayscale effect:
```typescript
const grayscaleUrl = "https://picsum.photos/500/300?grayscale";
```

#### Blur
Add blur effect (blur=1 to blur=10):
```typescript
const blurredUrl = "https://picsum.photos/500/300?blur=5";
```

### 5. Combining Effects
You can combine multiple effects using the & operator:
```typescript
const combinedUrl = "https://picsum.photos/500/300?grayscale&blur=2";
```

### 6. File Formats

#### JPEG
Explicitly request JPEG format:
```typescript
const jpegUrl = "https://picsum.photos/500/300.jpg";
```

#### WebP
Request WebP format for better compression:
```typescript
const webpUrl = "https://picsum.photos/500/300.webp";
```

## Best Practices

1. **Image Sizing**
   - Always specify dimensions that match your UI requirements
   - Consider device pixel ratios for retina displays
   - Use consistent sizes across similar UI elements

2. **Performance**
   - Use WebP format when possible for better performance
   - Implement proper loading states while images load
   - Consider implementing lazy loading for lists

3. **Caching**
   - Use the random parameter when you need unique images
   - Use seed when you want consistent images across reloads
   - Consider implementing local caching for frequently used images

## Example Implementation in Pattern Bridge

Here's how we use Lorem Picsum in our InfiniteScrollDemo:

```typescript
interface Item {
  id: number;
  imageUrl: string;
}

const generateItems = (start: number, count: number): Item[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    imageUrl: `https://picsum.photos/500/300?random=${start + i}`,
  }));
};
```

This implementation:
- Uses consistent 500x300px images
- Ensures unique images by using the index as random seed
- Works well with infinite scroll by using the start index

## Error Handling

Lorem Picsum is generally very reliable, but you should still handle potential errors:

```typescript
const ImageComponent = ({ url }: { url: string }) => {
  const [error, setError] = useState(false);
  
  return (
    <Image
      source={{ uri: url }}
      onError={() => setError(true)}
      fallback={error ? <FallbackComponent /> : null}
    />
  );
};
```

## Rate Limiting & Usage Guidelines

- Lorem Picsum is free to use
- No API key required
- No explicit rate limits, but be respectful
- Consider caching images in production
- Add proper attribution when required

## Resources

- [Official Lorem Picsum Website](https://picsum.photos)
- [Lorem Picsum on GitHub](https://github.com/DMarby/picsum-photos)
- [List of Available Images](https://picsum.photos/images)

## Contributing

If you find new ways to use Lorem Picsum in Pattern Bridge or discover useful features, please:
1. Document your findings
2. Share examples with the team
3. Update this documentation
4. Create reusable components when applicable
