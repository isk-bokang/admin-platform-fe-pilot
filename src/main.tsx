import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
import {BrowserRouter} from "react-router-dom";
import 'antd/dist/antd.css';
import { QueryClient, QueryClientProvider } from 'react-query';



const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} >
    <BrowserRouter>
      <App/>
    </BrowserRouter>

    </QueryClientProvider>
    
  </React.StrictMode>
)
