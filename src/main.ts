import { describe } from "vitest";

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

type PeopleWithData = (Person & { balance: number, incoming?: { id: number, amount: number }[], outgoing?: { id: number, amount: number }[] });

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

function getResult(people: PeopleWithData[]) {
  return people.map(person => {
    if (person.balance <= 0) {
      return person;
    }
    const debtors = people.filter(p => p.balance < 0);

    let incoming: { id: number, amount: number }[] = [];

    debtors.forEach(debtor => {
      if (person.balance > 0 && debtor.balance < 0) {
        const amount = Math.abs(Math.max(debtor.balance, person.balance));
        incoming = [...incoming, { id: debtor.id, amount }]
        debtor.balance += amount;
        debtor.outgoing = [...debtor.outgoing ?? [], { id: person.id, amount }]
        person.balance -= amount;
      }
    })

    return {
      ...person,
      incoming
    }
  });
}

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest
  describe('simple', () => {
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
  })

  describe('Belgie', () => {
    const people: Person[] = [
      {
        id: 1,
        name: 'Monique'
      },
      {
        id: 2,
        name: 'Jaap'
      },
      {
        id: 3,
        name: 'Martijn'
      },
      {
        id: 4,
        name: 'Tim'
      },
      {
        id: 5,
        name: 'Dennis'
      },
      {
        id: 6,
        name: 'Suzanne'
      },
      {
        id: 7,
        name: 'Evelien'
      },
      {
        id: 8,
        name: 'Max'
      },
      {
        id: 9,
        name: 'Nico'
      },
      {
        id: 10,
        name: 'Sandra'
      },
      {
        id: 11,
        name: 'Mieke'
      },
      {
        id: 12,
        name: 'Hans'
      }
    ];

    function i(name: typeof people[number]['name']) {
      return people.find(p => p.name === name)!.id;
    }

    const expenses: Expense[] = [
      {
        name: 'Drinken van picnic',
        participant_ids: [i('')],
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
  });
}

export { }
