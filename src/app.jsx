import { ToastContainer } from 'react-toastify'
import Home from './pages/home'
import { Route, Routes } from "react-router-dom"
import NotFound404 from './pages/not_found_404'
import Cart from './pages/cart'
import PageLayout from './components/layouts/page_layout.jsx'
import Product from './pages/product'
import SearchResult from './pages/search_result'
import Auth from './pages/auth'
import Account from './pages/account'
import { BrowserRouter } from "react-router-dom"
import { ProtectedRoute } from './utils/protected_resource'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getUser } from './store/actions/user_actions'
import Checkout from './pages/checkout'
import Admin from './pages/admin'
import MyStore from './pages/my_store'
import TermsOfUse from './pages/terms_of_use'
import webfont from 'webfontloader'
import FAQ from './pages/faq'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    webfont.load({
      google: {
        families: ['Nunito', 'Kanit', 'Arial', 'gillSans']
      }
    })

    dispatch(getUser())
  }, [dispatch])

  return (
    <div id="VCN-Shop-React-App">
      <BrowserRouter>
        <Routes>

          {/*Put routes with outlet layout*/}
          <Route path='/' element={<PageLayout />}>
            <Route index element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/productDetail/:productId' element={<Product />} />
            <Route path='/search/:keyword' element={<SearchResult />} />
            <Route path='/account/*' element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path='/admin' element={<ProtectedRoute isAdminRoute><Admin /></ProtectedRoute>} />
            <Route path='/myStore/*' element={<ProtectedRoute><MyStore /></ProtectedRoute>} />
            <Route path='/faq' element={<FAQ />} />
          </Route>

          {/*Put other routes with no layout*/}
          <Route path='/checkout/*' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path='/auth/*' element={<Auth />} />

          <Route path='/termOfUse' element={<TermsOfUse />} />

          <Route path='/*' element={<NotFound404 />} />

        </Routes>
      </BrowserRouter>

      <ToastContainer limit={3} autoClose={2000} pauseOnHover={true} draggable={false} />
    </div>
  )
}

export default App
