import Mock from 'mockjs'

interface IWords {
  key: string,
  id: string,
  word: string,
  wordPos: string,
  freshTime: string
}

const mockWords = (): IWords[] => {
  const arr = []
  for (let i = 0; i < 15; i++) {
    const mockItem: IWords = Mock.mock({
      key: Mock.Random.id(),
      id: Mock.Random.id(),
      name: Mock.Random.cname(),
      birthDay: Mock.Random.date('yyyy-MM-dd'),
      city: Mock.Random.county(true)
    })
    arr.push(mockItem)
  }
  return arr
}

const words = mockWords()


export { words }
