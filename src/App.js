import React, { useState } from 'react';
import './App.css';

function App() {
  // State variables for managing rectangles and interactions
  const [rectangles, setRectangles] = useState([]); // Array of rectangles
  const [selectedRectangleIndex, setSelectedRectangleIndex] = useState(null); // Index of the selected rectangle
  const [draggingRect, setDraggingRect] = useState(null); // Info about the dragging rectangle
  const [showJson, setShowJson] = useState(false); // Flag to show JSON view

  // Function to display JSON representation when the button is clicked
  function printRectanglesAsJson() {
    setShowJson(true);
  }

  // Function to generate a random color in hexadecimal format
  function generateRandomColor() {
    const maxColorValue = 0xFFFFFF;
    const randomNumber = Math.floor(Math.random() * maxColorValue);
    const hexColor = randomNumber.toString(16).padStart(6, '0');
    return `#${hexColor.toUpperCase()}`;
  }

  // Function to get a random coordinate within a specified range
  function getRandomCoordinate(maxValue) {
    return Math.floor(Math.random() * maxValue);
  }

  // Function to get a random dimension for rectangles
  function getRandomDimension() {
    return Math.floor(Math.random() * 10);
  }

  // Function to add a new rectangle
  function addRectangle() {
    const width = getRandomDimension() * 20;
    const height = getRandomDimension() * 20;
    const newY = getRandomCoordinate(700-height);
    const newRectangle = {
      x: getRandomCoordinate(600 - width),
      y: Math.max(newY, 100), // Ensure y position is at least 100
      width: width,
      height: height,
      zIndex: rectangles.length + 1,
      color: generateRandomColor(),
    };

    // Hide JSON view and update the rectangles array
    setShowJson(false);
    setRectangles((prevRectangles) => [...prevRectangles, newRectangle]);
  }

  // Function to select a rectangle by its index
  function selectRectangle(index) {
    setSelectedRectangleIndex(index);
  }

  // Handle mouse down event for rectangle dragging
  function handlePointerDown(e, index) {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const dragOffsetX = e.clientX - rect.left;
    const dragOffsetY = e.clientY - rect.top;
    setDraggingRect({ index, dragOffsetX, dragOffsetY });
    selectRectangle(index);
  }

  // Handle mouse move event for dragging rectangles
  function handlePointerMove(e) {
    if (draggingRect !== null) {
      const { index, dragOffsetX, dragOffsetY } = draggingRect;
      const rectWidth = rectangles[index].width;
      const rectHeight = rectangles[index].height;
      const canvasWidth = 600;
      const canvasHeight = 600;
      
      // Calculate the maximum allowed positions to keep the rectangle within the canvas
      const maxX = canvasWidth - rectWidth;
      const maxY = canvasHeight - rectHeight;
  
      // Calculate the new x and y position within the canvas boundaries
      const newX = Math.max(Math.min(e.clientX - dragOffsetX, maxX), 0);
      const newY = Math.max(Math.min(e.clientY - dragOffsetY, 700 - rectHeight), 100);
  
      // Update the rectangles array with the new position
      const updatedRectangles = rectangles.map((rectangle, i) =>
        i === index
          ? {
              ...rectangle,
              x: newX,
              y: newY,
            }
          : rectangle
      );
      setRectangles(updatedRectangles);
    }
  }

  // Handle mouse up event for ending rectangle dragging
  function handlePointerUp() {
    setDraggingRect(null);
    setSelectedRectangleIndex(null);
  }

  return (
    <div className="outer">
      <div className="buttons">
        <button onClick={addRectangle}>Add rectangle</button>
        <button onClick={printRectanglesAsJson}>Print JSON</button>
      </div>
      {/* Conditional rendering for JSON view or canvas view */}
      {showJson ? (
        <pre className="json-output">{JSON.stringify(rectangles, null, 2)}</pre>
      ) : (
        <div
          className="canvas"
          style={{ width: '600px', height: '600px', backgroundColor: 'pink' }}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
        >
          {/* Render rectangles */}
          {rectangles.map((rectangle, index) => (
            <div
              key={index}
              style={{
                width: `${rectangle.width}px`,
                height: `${rectangle.height}px`,
                backgroundColor: rectangle.color,
                position: 'absolute',
                left: `${rectangle.x}px`,
                top: `${rectangle.y}px`,
                zIndex: rectangle.zIndex,
                border: `${
                  selectedRectangleIndex === index ? '2px solid black' : 'none'
                }`,
              }}
              onMouseDown={(e) => handlePointerDown(e, index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
