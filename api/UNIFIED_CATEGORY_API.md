# Unified Category API Documentation

This document describes the unified API for managing categories and subcategories in a hierarchical structure.

## Overview

The unified category API consolidates all category and subcategory operations under a single endpoint: `/api/categories`. This provides a cleaner, more intuitive API structure that reflects the natural hierarchy of categories and subcategories.

## Base URL

All endpoints are prefixed with: `/api/categories`

## Category Endpoints

### Get All Categories
```
GET /api/categories
```

**Query Parameters:**
- `includeSubcategories` (boolean, optional) - Include subcategories in the response

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "iconUrl": "string|null",
      "imageUrl": "string|null",
      "link": "string|null",
      "isActive": "boolean",
      "sortOrder": "number",
      "createdAt": "date",
      "updatedAt": "date",
      "subcategories": [...] // Included only if includeSubcategories=true
    }
  ],
  "count": "number"
}
```

### Get Category By ID
```
GET /api/categories/:id
```

**Query Parameters:**
- `includeSubcategories` (boolean, optional) - Include subcategories in the response

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "iconUrl": "string|null",
    "imageUrl": "string|null",
    "link": "string|null",
    "isActive": "boolean",
    "sortOrder": "number",
    "createdAt": "date",
    "updatedAt": "date",
    "subcategories": [...] // Included only if includeSubcategories=true
  }
}
```

### Create Category
```
POST /api/categories
```

**Headers:**
- `Authorization: Bearer <token>` (required for admin operations)
- `Content-Type: multipart/form-data` (for file uploads)

**Body:**
```json
{
  "title": "string",
  "link": "string",
  "isActive": "boolean",
  "sortOrder": "number",
  "icon": "file", // Optional
  "image": "file" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "string",
    "title": "string",
    "iconUrl": "string|null",
    "imageUrl": "string|null",
    "link": "string|null",
    "isActive": "boolean",
    "sortOrder": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Update Category
```
PUT /api/categories/:id
```

**Headers:**
- `Authorization: Bearer <token>` (required for admin operations)
- `Content-Type: multipart/form-data` (for file uploads)

**Body:**
```json
{
  "title": "string",
  "link": "string",
  "isActive": "boolean",
  "sortOrder": "number",
  "iconUrl": "string|null", // Optional
  "imageUrl": "string|null" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "string",
    "title": "string",
    "iconUrl": "string|null",
    "imageUrl": "string|null",
    "link": "string|null",
    "isActive": "boolean",
    "sortOrder": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Delete Category
```
DELETE /api/categories/:id
```

**Headers:**
- `Authorization: Bearer <token>` (required for admin operations)

**Response:**
```json
{
  "success": true,
  "message": "Category and all associated subcategories deleted successfully"
}
```

### Toggle Category Status
```
PATCH /api/categories/:id/toggle
```

**Headers:**
- `Authorization: Bearer <token>` (required for admin operations)

**Response:**
```json
{
  "success": true,
  "message": "Category activated/deactivated successfully",
  "data": {
    "id": "string",
    "title": "string",
    "iconUrl": "string|null",
    "imageUrl": "string|null",
    "link": "string|null",
    "isActive": "boolean",
    "sortOrder": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

## Subcategory Endpoints

All subcategory operations are nested under their parent category.

### Get Subcategories for Category
```
GET /api/categories/:categoryId/subcategories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "categoryId": "string",
      "isActive": "boolean",
      "sortOrder": "number",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "count": "number"
}
```

### Get Subcategory By ID
```
GET /api/categories/subcategories/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "categoryId": "string",
    "isActive": "boolean",
    "sortOrder": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Create Subcategory
```
POST /api/categories/:categoryId/subcategories
```

**Headers:**
- `Authorization: Bearer <token>` (required for admin operations)
- `Content-Type: application/json`

**Body:**
```json
{
  "name": "string",
  "isActive": "boolean",
  "sortOrder": "number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subcategory created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "categoryId": "string",
    "isActive": "boolean",
    "sortOrder": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Update Subcategory
```
PUT /api/categories/subcategories/:id
```

**Headers:**
- `Authorization: Bearer <token>` (required for admin operations)
- `Content-Type: application/json`

**Body:**
```json
{
  "name": "string",
  "categoryId": "string", // Optional - to move subcategory to another category
  "isActive": "boolean",
  "sortOrder": "number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subcategory updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "categoryId": "string",
    "isActive": "boolean",
    "sortOrder": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Delete Subcategory
```
DELETE /api/categories/subcategories/:id
```

**Headers:**
- `Authorization: Bearer <token>` (required for admin operations)

**Response:**
```json
{
  "success": true,
  "message": "Subcategory deleted successfully"
}
```

### Toggle Subcategory Status
```
PATCH /api/categories/subcategories/:id/toggle
```

**Headers:**
- `Authorization: Bearer <token>` (required for admin operations)

**Response:**
```json
{
  "success": true,
  "message": "Subcategory activated/deactivated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "categoryId": "string",
    "isActive": "boolean",
    "sortOrder": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

## Benefits of the Unified API

1. **Hierarchical Organization**: Subcategories are naturally grouped under their parent categories
2. **Consistent Naming**: All category-related operations use the same base endpoint
3. **Simplified Routing**: Fewer base routes to manage
4. **Clear Relationships**: URL structure reflects data relationships
5. **Backward Compatibility**: Existing functionality is preserved while offering improved organization

## Migration Notes

Existing code using separate `/api/categories` and `/api/subcategories` endpoints should be updated to use the new unified structure:

- Replace `/api/subcategories` with `/api/categories/subcategories`
- Replace `/api/subcategories/:id` with `/api/categories/subcategories/:id`
- Replace `/api/subcategories/category/:categoryId` with `/api/categories/:categoryId/subcategories`