# VRL Site Content Management Guide

This guide explains how to update content on the VRL site (people, research, publications, alumni, and news).

## Overview

The site uses a simple content management approach:
1. Content is stored in JSON files in the `data/` directory
2. JavaScript loads these files and renders content dynamically
3. To update content, simply edit the relevant JSON file

## Updating People

**File:** `data/people/people.json`

People are organized by categories:
- faculty
- graduateStudents
- researchers
- undergraduates

Example person entry:
```json
{
        "name": "First Last",
        "role": "Ph.D. Student",
        "photo": "img/people/person.jpg",
        "shortRole": "Ph.D. Student",
        "bio": "Put their bio here",
        "research": "Computer Vision",
        "email": "test-email@ucsb.edu"
      },
```

**Adding a new person:**
1. Add their photo to `img/people/` folder
2. Add their entry to the appropriate category in `people.json`

## Updating Alumni

**File:** `data/people/alumni.json`

Example alumni entry:
```json
{
  "name": "Alumni Name",
  "year": "2023",
  "degree": "Ph.D.",
  "thesis": "Thesis Title",
  "position": "Current Position"
}
```

Alumni are automatically grouped by graduation year.

## Updating Research Projects

**File:** `data/research/research.json`

Example research project:
```json
{
  "title": "Project Title",
  "description": "Project description text",
  "beforeImage": "filename-before.png",
  "afterImage": "filename-after.png"
}
```

**Adding a new research project:**
1. Add before/after images to `img/research/` folder
2. Add project entry to `research.json`

## Updating Publications

**File:** `data/publications/publications.json`

Publications are organized by year and tag. Available tags are in `data/publications/tags.json`. Tags and images are many-to-many.

Example publication entry:
```json
{
      "id": id,
      "title": "Paper Title",
      "authors": "Paper Authors",
      "year": year,
      "month": "Month",
      "publication_venue": "",
      "abstract": "",
      "pdf_link": "#",
      "doi_link": "#",
      "category": "recent",
      "tags": ["tag1", "tag2"]
    }
```

## Updating News

**File:** `data/news/news.json`

Example news entry:
```json
{
  "title": "News Title",
  "date": "2023-03-19",
  "content": "News content text"
}
```

The 3 most recent news items are displayed on the homepage.

## Important Notes

1. **Images**: Make sure to optimize images before adding (compress, resize)
2. **JSON Format**: Ensure your JSON is properly formatted with correct commas, quotes, and brackets
3. **Testing**: After updating, verify changes on the site to ensure everything appears correctly
4. **Backup**: Always make a backup of JSON files before making major changes

## Troubleshooting

If content doesn't appear after updating:
1. Check browser console for JavaScript errors
2. Verify JSON syntax using a JSON validator
3. Clear browser cache and reload the page
4. Ensure file paths and names are correct