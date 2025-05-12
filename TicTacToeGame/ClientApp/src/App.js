import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';

import TicTacToe from './TicTacToe/TicTacToe';
import './TicTacToe/TicTacToe.css';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <a className="navbar-brand" href="/">Крестики-нолики</a>
                    </div>
                </nav>
                <TicTacToe />
                <footer className="bg-light text-center text-muted py-3 mt-5">
                    <div className="container">
                        &copy; {new Date().getFullYear()} Крестики-нолики • ASP.NET Core 8 + PostgreSQL + React + Bootstrap 5
                    </div>
                </footer>

                <Layout>
                    <Routes>
                        {AppRoutes.map((route, index) => {
                            const { element, ...rest } = route;
                            return <Route key={index} {...rest} element={element} />;
                        })}
                    </Routes>
                </Layout>
            </div>

        );
    }
}
