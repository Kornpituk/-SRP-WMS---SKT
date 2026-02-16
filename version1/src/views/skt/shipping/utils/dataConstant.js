export const itemsStatus = ([
  { name: 'Cancel', id: 200, color: 'blue-grey' },
  { name: 'ETL Failed!', id: 201, color: 'deep-orange' },
  { name: 'Waiting for Shipping', id: 202, color: 'pink' },
  { name: 'Draft Shipping', id: 203, color: 'amber' },

  { name: 'In Submitting', id: 204, color: 'pink' },
  { name: 'Waiting for WH APVL', id: 205, color: 'brown' },
  { name: 'Shipping Rejected', id: 206, color: 'red' },
  { name: 'Shipping Completed', id: 207, color: 'green' },

  { name: 'All', id: 0, color: 'grey' },

])


export const getStatusIdByName = statusName => {
  const matchedItem = itemsStatus.find(item => item.name === statusName)

  return matchedItem ? matchedItem.id : '' // คืนค่า id หรือ null หากไม่พบ
}
