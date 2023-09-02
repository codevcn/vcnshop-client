
import Sentry from "../configs/sentry"
import ErrorPage from "../pages/error_page"

const SentryErrorBoundary = ({ children }) => {
    return (
        <Sentry.ErrorBoundary fallback={<ErrorPage />}>
            {children}
        </Sentry.ErrorBoundary>
    )
}

export default SentryErrorBoundary