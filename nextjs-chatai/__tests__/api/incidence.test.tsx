import Incidence from '../../models/Incidence'
import { act, render, screen } from '@testing-library/react';
import { connectDB } from '../../utils/db'

jest.mock('mongoose');

async function initializeDB() {
    await connectDB()
}


describe('insert', () => {

    beforeAll(async () => {
        await initializeDB()
        
        Incidence.find()
    })
    it('', async() => {

        return 'prueba'
    })
})

