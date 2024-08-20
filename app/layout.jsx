import '../styles/globals.css';

export const metadata = {
    title: {
        template: '%s | Netlify',
        default: 'Four to Follow 2024/25'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-theme="lofi">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased">
                <div className="flex flex-col min-h-screen px-6 sm:px-12">
                    <div className="flex flex-col w-full max-w-full xl:max-w-[90%] 2xl:max-w-[80%] mx-auto grow">
                        <div className="grow">{children}</div>
                    </div>
                </div>
            </body>
        </html>
    );
}
