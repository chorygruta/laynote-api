module.exports = `
  type Category {
    id: ID
    name: String
    createdAt: String
    updatedAt: String
    userId: ID
    notes: [Note]
  }

  input CreateCategoryInput {
    name: String
  }

  type CreateCategoryPayload {
    category: Category
    message: String
  }

  input UpdateCategoryInput {
    name: String
  }

  type UpdateCategoryPayload {
    old_category: Category,
    updated_category: Category,
    message: String
  }

  type DeleteCategoryPayload {
    deleted_id: ID
    message: String
  }

  type Query {
    category(id: ID): Category
    categories: [Category!]!
  }

  type Mutation {
    createCategory(body: CreateCategoryInput): CreateCategoryPayload
	  updateCategory(id: ID!, body: UpdateCategoryInput): UpdateCategoryPayload
	  deleteCategory(id: ID!): DeleteCategoryPayload
  }
`;
