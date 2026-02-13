export interface SampleDataset {
  name: string;
  description: string;
  format: "json" | "csv";
  data: string;
}

export const sampleDatasets: SampleDataset[] = [
  {
    name: "Users",
    description: "Sample user data (5 rows)",
    format: "json",
    data: JSON.stringify(
      [
        {
          id: 1,
          name: "Alice Johnson",
          email: "alice@example.com",
          age: 28,
          city: "New York",
        },
        {
          id: 2,
          name: "Bob Smith",
          email: "bob@example.com",
          age: 34,
          city: "San Francisco",
        },
        {
          id: 3,
          name: "Carol White",
          email: "carol@example.com",
          age: 25,
          city: "Austin",
        },
        {
          id: 4,
          name: "David Brown",
          email: "david@example.com",
          age: 42,
          city: "Seattle",
        },
        {
          id: 5,
          name: "Eve Davis",
          email: "eve@example.com",
          age: 31,
          city: "Boston",
        },
      ],
      null,
      2
    ),
  },
  {
    name: "Products",
    description: "Sample product catalog (6 rows)",
    format: "json",
    data: JSON.stringify(
      [
        {
          id: 101,
          name: "Laptop",
          category: "Electronics",
          price: 999,
          stock: 15,
        },
        {
          id: 102,
          name: "Mouse",
          category: "Electronics",
          price: 25,
          stock: 150,
        },
        {
          id: 103,
          name: "Keyboard",
          category: "Electronics",
          price: 75,
          stock: 80,
        },
        { id: 104, name: "Desk", category: "Furniture", price: 299, stock: 12 },
        {
          id: 105,
          name: "Chair",
          category: "Furniture",
          price: 199,
          stock: 25,
        },
        {
          id: 106,
          name: "Monitor",
          category: "Electronics",
          price: 349,
          stock: 40,
        },
      ],
      null,
      2
    ),
  },
  {
    name: "Sales",
    description: "Sample sales data (CSV, 7 rows)",
    format: "csv",
    data: `date,product,quantity,revenue,region
2024-01-15,Laptop,3,2997,North
2024-01-16,Mouse,12,300,South
2024-01-17,Keyboard,5,375,East
2024-01-18,Monitor,2,698,West
2024-01-19,Desk,1,299,North
2024-01-20,Chair,4,796,South
2024-01-21,Laptop,2,1998,East`,
  },
];
