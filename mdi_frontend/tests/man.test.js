import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Main from '../src/Components/Main/main'; 


describe('Home page',()=>{
    test('Check for the page display',()=>{
        // Arrange
        render(<Main/>);
        //Act
        //. ... nothing
    
        //Assert
        const resultElement = screen.getByText('Medical Drug Search',{exact:false});
        expect(resultElement).toBeInTheDocument();
    });
})