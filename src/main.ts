
function owed(data: {
  name: string;
  paid: number;
}[]) {
  const total = data.reduce((acc, curr) => acc + curr.paid, 0);
  const average = total / data.length;
  return data.map(person => {
    if (person.paid > average) {
      return {
        name: person.name,
        owed: person.paid - average
      }
    }

    return {
      name: person.name,
      toPay: average - person.paid
    }
  });
}

type Person = {
  id: number;
  name: string;
}


type Expense = {
  name: string;
  participant_ids: number[];
  payer_id: number;
  cost: number;
};


function getBalance(expenses: Expense[], people: Person[]) {
  return people.map(person => {
    const positive = expenses.filter(expense => expense.payer_id === person.id).reduce((total, curr) => total + curr.cost, 0);
    const negative = expenses.filter(expense => expense.participant_ids.includes(person.id)).reduce((total, contributedExpense) => total + contributedExpense.cost / contributedExpense.participant_ids.length, 0);
    return {

      ...person,
      balance: positive - negative
    }
  });

}

type PeopleWithData = (Person & { balance: number, incoming?: { id: number, amount: number }[], outgoing?: { id: number, amount: number }[] });

function getResult(people: PeopleWithData[]) {
  return people.map(person => {
    if (person.balance > 0) {
      const debtors = people.filter(p => p.balance < 0);

      let incoming: { id: number, amount: number }[] = [];

      debtors.forEach(debtor => {
        if (person.balance > 0 && debtor.balance < 0) {
          const amount = Math.abs(Math.max(debtor.balance, person.balance));
          incoming.push({ id: debtor.id, amount })
          debtor.balance += amount;
          debtor.outgoing = [...debtor.outgoing ?? [], { id: person.id, amount }]
          person.balance -= amount;
        }
      })

      return {
        ...person,
        incoming
      }
    }

    return {
      ...person,

    }



  });
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('calculates stuff', () => {
    const balance = getBalance(expenses, people);
    expect(balance).toEqual([
      {
        id: 1,
        name: 'User 1',
        balance: 100,
      },
      {
        id: 2,
        name: 'User 2',
        balance: 200,
      },
      {
        id: 3,
        name: 'User 3',
        balance: -300,
      }
    ])
    const result = getResult(balance);




    expect(result).toEqual([
      {
        id: 1,
        name: 'User 1',
        balance: 0,
        incoming: [
          { id: 3, amount: 100 },
        ]
      },
      {
        id: 2,
        name: 'User 2',
        balance: 0,
        incoming: [
          { id: 3, amount: 200 },
        ]
      },
      {
        id: 3,
        name: 'User 3',
        balance: 0,
        outgoing: [
          { id: 1, amount: 100 },
          { id: 2, amount: 200 }
        ]
      }
    ])
  })

  const people: Person[] = [
    {
      id: 1,
      name: 'User 1'
    },
    {
      id: 2,
      name: 'User 2'
    },
    {
      id: 3,
      name: 'User 3'
    }
  ];

  const expenses: Expense[] = [
    {
      name: 'Biking trip',
      participant_ids: [1, 2, 3],
      payer_id: 1,
      cost: 150
    },
    {
      name: 'Parachuting',
      participant_ids: [2, 3],
      payer_id: 2,
      cost: 500
    }
  ];












  it('should calculate', () => {

    const data1 = [
      {
        name: 'User 1',
        paid: 200,
      },
      {
        name: 'User 2',
        paid: 100,
      }
    ];
    expect(owed(data1)).toEqual([{
      name: 'User 1',
      owed: 50,
    },
    {
      name: 'User 2',
      toPay: 50,
    }])
  })
}

export { }
