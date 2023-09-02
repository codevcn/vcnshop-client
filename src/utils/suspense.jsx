
import { Suspense } from 'react'
import LoadingApp from '../components/loading_app'

const suspenseComponent = (Component) => (fallback = <LoadingApp />) => {
    return (componentProps) => (
        <Suspense fallback={fallback}>
            <Component {...componentProps} />
        </Suspense>
    )
}

export default suspenseComponent