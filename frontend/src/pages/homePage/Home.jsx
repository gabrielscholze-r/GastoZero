import React from 'react'

export default function Home() {
    return (
        <div className="h-screen w-full flex items-center justify-center font-display">
            <div className="w-2/3 h-2/3 bg-containerbg rounded p-5 flex flex-col ">
                <h1 className="text-3xl font-bold text-center text-textcontainerbg mt-4">
                    Welcome to Spend Zero!
                </h1>
                <div className="flex-1 overflow-auto px-2 text-left text-xl text-textcontainerbg mt-10 indent-4">
                    <p>
                        Spend Zero is a personal finance management web application built as a learning project using Golang and React.js.
                        It allows users to securely track and manage their income and expenses in a simple and intuitive way.
                    </p>
                    <p className="mt-4">
                        The application is designed to make it easy and effortless to record your financial transactions, offering a fluid and responsive interface that minimizes friction at every step. Whether you're logging daily expenses or reviewing your monthly budget, Spend Zero provides a streamlined experience that adapts to your routine.
                    </p>
                    <p className="mt-4">
                        With a clear and accessible reports section, you can quickly gain insights into your financial habits, identify where your money goes, and make more informed decisions. Everything is built to give you full control and clarity over your finances — without complexity.
                    </p>
                </div>
            </div>
        </div>
    )
}