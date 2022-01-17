// import { createClient } from '@supabase/supabase-js';
// import { map } from 'nanostores';

// const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDUxMDA0NiwiZXhwIjoxOTU2MDg2MDQ2fQ.Kyj15LQtHSUIPNYfwyRl80Z-l_9lSuuj6aQYBCdCRwM';

// const supabase = createClient('https://yczexghbssekmklnjgxp.supabase.co', API_KEY);

// export const supabaseState = map({
//   something: undefined as any
// })

// supabase.from('Content').insert([
//   { from: 'Alexey Revo', value: 'Lorem Ipsum dolor amet' },
// ]).then(({ error }) => console.log(error))

// // supabase.from('Content').select().then(response => {
// //   response.data?.forEach(value => {
// //     console.log(value);
// //   })
// // })

// console.log('supabase')