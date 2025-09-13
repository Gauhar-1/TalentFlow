import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { seedDatabase } from './api/seed.ts';

async function deferRender() {
  const { worker } = await import('./api/browser.ts');
  return worker.start();
}



deferRender().then(async()=>{

  await seedDatabase();

   createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <App />
  </StrictMode>,
);
})


