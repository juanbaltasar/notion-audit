import { Client } from "@notionhq/client";
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Get all pages in a workspace
export async function getAllPages() {
  try {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      }
    });
    return response.results;
  } catch (error) {
    console.error("Error retrieving pages:", error);
    throw error;
  }
}

export async function getDirectWorkspacePages() {
  try {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      }
    });
    return response.results.filter(page => 
      'parent' in page && page.parent.type === 'workspace'
    );
  } catch (error) {
    console.error("Error retrieving workspace pages:", error);
    throw error;
  }
}

// Get a single item by ID
export async function getItemById(itemId: string) {
  try {
    const response = await notion.pages.retrieve({
      page_id: itemId,
    });
    return response;
  } catch (error) {
    console.error("Error retrieving item by ID:", error);
    throw error;
  }
}

// Get all children blocks of a page
export async function getPageChildren(pageId: string) {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100, // Adjust as needed
    });
    
    const filteredResults = response.results.filter(
      block => 'type' in block && (block.type === 'child_page' || block.type === 'child_database')
    );
    return filteredResults;
  } catch (error) {
    console.error("Error retrieving page children:", error);
    throw error;
  }
}

// Get all children pages and databases recursively
export async function getAllChildrenRecursively(pageId: string) {
  try {
    // Get direct children first
    const directChildren = await getPageChildren(pageId);
    let allChildren = [...directChildren];

    // Recursively get children of each child page
    for (const child of directChildren) {
      if (child.type === 'child_page' || child.type === 'child_database') {
        const childrenOfChild = await getAllChildrenRecursively(child.id);
        allChildren = allChildren.concat(childrenOfChild);
      }
    }
    
    return allChildren;
  } catch (error) {
    console.error("Error retrieving all children recursively:", error);
    throw error;
  }
}

// Get all items from a Notion database
export async function getDatabaseItems(databaseId: string) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100, // Adjust as needed
    });
    
    return response.results;
  } catch (error) {
    console.error("Error retrieving database items:", error);
    throw error;
  }
}

// Get database properties and schema
export async function getDatabaseSchema(databaseId: string) {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    return response;
  } catch (error) {
    console.error("Error retrieving database schema:", error);
    throw error;
  }
}