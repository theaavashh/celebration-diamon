# Celebration Diamond - TV Display

A Next.js application designed specifically for displaying products in a carousel format on television screens. This application is optimized for TV display with auto-play functionality, large text, and TV-friendly styling.

## Features

- **Product Carousel**: Displays products in an elegant carousel format
- **Auto-play**: Automatically cycles through products every 8 seconds
- **TV Optimized**: Large text, high contrast, and TV-friendly styling
- **Real-time Clock**: Shows current time and date
- **API Integration**: Fetches products from the main API
- **Fallback Data**: Shows demo products if API is unavailable
- **Responsive Design**: Adapts to different TV screen sizes
- **No User Interaction**: Designed for passive viewing

## Quick Start

### Development Mode
```bash
cd tv-display
npm run dev:tv
```
The TV display will be available at `http://localhost:3001`

### Production Mode
```bash
cd tv-display
npm run build
npm run start:tv
```

## Configuration

The application can be configured through `/src/config/tvConfig.ts`:

- **Autoplay Delay**: Time between slides (default: 8 seconds)
- **API Endpoint**: Backend API URL
- **Company Information**: Name, contact details, hours
- **Display Settings**: What information to show/hide
- **Styling**: Colors and visual preferences

## TV Setup Instructions

1. **Connect TV to Computer**: Use HDMI cable or wireless display
2. **Set TV Resolution**: Recommended 1920x1080 or higher
3. **Disable Screen Saver**: Prevent TV from going to sleep
4. **Open Browser**: Navigate to `http://localhost:3001`
5. **Enter Full Screen**: Press F11 or use browser fullscreen
6. **Disable Cursor**: Cursor is automatically hidden

## API Integration

The TV display connects to the main Celebration Diamond API:

- **Endpoint**: `http://localhost:5000/api/products`
- **Fallback**: If API is unavailable, shows demo products
- **Retry Logic**: Automatically retries failed requests
- **Error Handling**: Gracefully handles network issues

## Customization

### Adding New Products
Products are fetched from the API. To add new products:
1. Use the admin panel to add products
2. Ensure products are marked as "Active"
3. The TV display will automatically show them

### Changing Display Settings
Edit `/src/config/tvConfig.ts`:
- `autoplayDelay`: Time between slides
- `showTime`: Show/hide clock
- `showContactInfo`: Show/hide contact details
- `companyName`: Your company name
- `contactPhone`: Your phone number

### Styling Changes
- Colors: Edit the gradient in `TVProductCarousel.tsx`
- Fonts: Modify Tailwind classes
- Layout: Adjust grid and spacing classes

## Troubleshooting

### TV Display Not Showing
- Check if API server is running on port 5000
- Verify TV display is running on port 3001
- Check browser console for errors

### Products Not Loading
- Verify API endpoint in config
- Check network connection
- Fallback products will show if API fails

### Performance Issues
- Close other applications
- Use hardware acceleration in browser
- Consider using a dedicated device for TV display

## Browser Requirements

- **Chrome**: Recommended for best performance
- **Firefox**: Supported
- **Safari**: Supported
- **Edge**: Supported

## Production Deployment

For production deployment:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to server**:
   - Upload built files to web server
   - Configure reverse proxy if needed
   - Set up SSL certificate

3. **Configure for TV**:
   - Use dedicated device (Raspberry Pi, mini PC)
   - Set up auto-start on boot
   - Configure browser to open TV display
   - Disable screen saver and power management

## Support

For technical support or customization requests, contact the development team.

---