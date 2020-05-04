const boards = [
      {
        id: 1000,
        title: 'Course Ideas',
        background: '#ffad33',
      },
      {
        id: 2000,
        title: 'House Ideas',
        background: '#80ccff',
      },
      {
        id: 3000,
        title: 'Garden Ideas',
        background: '#ff3300',
      },
    ]
    
    const lists = [
      {
        id: 100,
        title: 'Wednesday 15th April',
        board: 1000,
        cards: [
          {
            id: 1,
            text: 'Instagram',
          },
          {
            id: 2,
            text: 'Twitter',
          },
        ],
      },
      {
        id: 300,
        title: 'Friday 17th April',
        board: 1000,
        cards: [
          {
            id: 11,
            text: 'LinkedIn',
          },
          {
            id: 22,
            text: 'Twitter',
          },
        ],
      },
      {
        id: 200,
        title: 'Monday 21st April',
        board: 2000,
        cards: [
          {
            id: 11,
            text: 'Instagram',
          },
          {
            id: 22,
            text: 'Instagram Story',
          },
        ],
      },
    ]
    
    const data = {
      boards,
      lists,
    }
    
    export default data
    
    