module.exports = `
  type Note {
    id: ID
    title: String
    content: String
    createdAt: String
    updatedAt: String
    userId: ID
    categoryId: ID
    category: Category
  }

  input CreateNoteInput {
    title: String!
    content: String!
    categoryId: ID
  }

  type CreateNotePayload {
    note: Note
    message: String
  }

  input UpdateNoteInput {
    title: String
    content: Boolean
    categoryId: ID
  }

  type UpdateNotePayload {
    old_note: Note,
    updated_note: Note,
    message: String
  }

  type DeleteNotePayload {
    deleted_id: ID
    message: String
  }

  input NoteFilter {
    categoryId: ID
  }

  type Query {
    note(id: ID): Note
    notes(filter: NoteFilter): [Note!]!
  }

  type Mutation {
    createNote(body: CreateNoteInput): CreateNotePayload
	  updateNote(id: ID!, body: UpdateNoteInput): UpdateNotePayload
	  deleteNote(id: ID!): DeleteNotePayload
  }
`;
