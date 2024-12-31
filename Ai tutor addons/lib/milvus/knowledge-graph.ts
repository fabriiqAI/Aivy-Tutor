import { getMilvusClient } from './client';
import { v4 as uuidv4 } from 'uuid';

export async function createRelationship({
  userId,
  sourceId,
  targetId,
  relationshipType,
  metadata = {}
}: {
  userId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  metadata?: Record<string, any>;
}) {
  const client = await getMilvusClient();

  await client.insert({
    collection_name: 'knowledge_graph',
    data: [{
      id: uuidv4(),
      user_id: userId,
      source_id: sourceId,
      target_id: targetId,
      relationship_type: relationshipType,
      metadata: JSON.stringify(metadata)
    }]
  });
}

export async function findRelatedContent({
  userId,
  contentId,
  relationshipTypes = [],
  maxDepth = 2
}: {
  userId: string;
  contentId: string;
  relationshipTypes?: string[];
  maxDepth?: number;
}) {
  const client = await getMilvusClient();
  const visited = new Set<string>();
  const results = [];

  async function traverse(currentId: string, depth: number) {
    if (depth > maxDepth || visited.has(currentId)) return;
    visited.add(currentId);

    const filter = `user_id == "${userId}" && (source_id == "${currentId}" || target_id == "${currentId}")`;
    if (relationshipTypes.length > 0) {
      filter += ` && relationship_type in ${JSON.stringify(relationshipTypes)}`;
    }

    const relationships = await client.query({
      collection_name: 'knowledge_graph',
      filter,
      output_fields: ['source_id', 'target_id', 'relationship_type', 'metadata']
    });

    for (const rel of relationships) {
      const nextId = rel.source_id === currentId ? rel.target_id : rel.source_id;
      results.push(rel);
      await traverse(nextId, depth + 1);
    }
  }

  await traverse(contentId, 0);
  return results;
}