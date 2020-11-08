const header = [
  {
    id: 'id',
    title: 'ID',
    sortable: false
  },
  {
    id: 'user',
    title: 'User',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'createdAt',
    title: "Date",
    sortable: false,
    template: data => {
      const date = new Intl.DateTimeFormat('ru-en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date(data));
      return `
        <div class="sortable-table__cell">
          ${date}
        </div>
      `;
    }
  },
  {
    id: 'totalCost',
    title: 'Total cost',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'delivery',
    title: 'Status',
    sortable: false
  },
];

export default header;
