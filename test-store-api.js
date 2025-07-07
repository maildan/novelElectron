// 🔥 electron-store API 테스트
import Store from 'electron-store';

interface TestSchema {
  app: {
    theme: string;
  };
}

const store = new Store<TestSchema>({
  name: 'test',
  defaults: {
    app: {
      theme: 'light'
    }
  }
});

// API 테스트
console.log('Store methods:', Object.getOwnPropertyNames(store));
console.log('Store prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(store)));
