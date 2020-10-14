import React, {useState} from 'react';
import './App.css';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import _ from 'lodash';
import {v4} from 'uuid';
import {Button, Navbar, Nav} from 'react-bootstrap';
import {GiTrashCan} from 'react-icons/gi';
function App() {
  const [text, setText] = useState('');
  const [columnName, setColumnName] = useState('');
  const [rendering, setRendering] = useState(false);

  const [state, setState] = useState({
    Todo: {
      addOpen: 'none',
      title: 'Todo',
      items: [],
    },
    Done: {
      addOpen: 'none',
      title: 'Done',
      items: [],
    },
    Doing: {
      addOpen: 'none',
      title: 'Doing',
      items: [],
    },
  });

  const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Creating a copy of item before removing it from state
    const itemCopy = {...state[source.droppableId].items[source.index]};

    setState((prev) => {
      prev = {...prev};
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1);

      // Adding to new items array location
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  const addItem = (e) => {
    if (text === '') return;
    setState((prev) => {
      return {
        ...prev,
        [e]: {
          title: e,
          items: [
            {
              id: v4(),
              name: text,
            },
            ...prev[e].items,
          ],
          addOpen: 'none',
        },
      };
    });

    setText('');
  };

  const toggle = (e) => {
    setState((prev) => {
      return {
        ...prev,
        [e]: {
          ...prev[e],
          addOpen: 'block',
        },
      };
    });
  };

  const addColumn = () => {
    if (columnName === '') return;
    setState((prev) => {
      return {
        ...prev,
        [columnName]: {
          title: columnName,
          items: [],
          addOpen: 'none',
        },
      };
    });

    setColumnName('');
  };

  const removeItem = (title, index) => {
    if (index > -1) {
      state[title].items.splice(index, 1);
      setRendering(!rendering);
    }
  };

  return (
    <div className="main">
      <Navbar className="navbar-top" collapseOnSelect expand="lg">
        <Navbar.Brand href="/">
          <img
            src="https://d2k1ftgv7pobq7.cloudfront.net/meta/u/res/images/brand-assets/Logos/0099ec3754bf473d2bbf317204ab6fea/trello-logo-blue.png"
            alt="logo"
            width="100px"
            style={{zIndex: 1}}
          />
        </Navbar.Brand>

        <span className="user-text">Hello User!</span>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" />

          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/">Contact</Nav.Link>
            <Nav.Link href="/">About Us</Nav.Link>

            <img
              width="40px"
              src="https://img.pngio.com/simple-user-icon-transparent-png-stickpng-user-logo-png-2240_2240.png"
              alt="img"
            />
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="App">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className={'column'}>
                <h3>
                  {data.title}
                  <span
                    style={{
                      float: 'right',
                      paddingRight: '20px',
                      fontSize: '25px',
                      cursor: 'pointer',
                      marginTop: '-7px',
                      color: 'green',
                    }}
                    onClick={() => {
                      toggle(data.title);
                    }}
                  >
                    <b>+</b>
                  </span>
                </h3>
                <div style={{display: [data.addOpen]}}>
                  <h3 className="add-list-heading">Add a List</h3>
                  <input
                    type="text"
                    value={text}
                    placeholder="Enter Card name"
                    className="add-list-input"
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Button variant="success" onClick={() => addItem(data.title)}>
                    Add
                  </Button>
                </div>

                <Droppable droppableId={key}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={'droppable-col'}
                      >
                        {data.items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided, snapshot) => {
                                console.log(snapshot);
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && 'dragging'
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {el.name}
                                    <span
                                      style={{
                                        float: 'right',
                                        paddingRight: '7px',
                                        fontSize: '18px',
                                        paddingTop: '5px',
                                        cursor: 'pointer',
                                        marginTop: '-10px',
                                        color: 'red',
                                      }}
                                      onClick={() => {
                                        removeItem(data.title, index);
                                      }}
                                    >
                                      <GiTrashCan />
                                    </span>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>

        <div className="add-column">
          <h3 className="add-list-heading">
            <b style={{fontSize: '20px'}}>+</b>Add a List
          </h3>

          <input
            className="add-list-input"
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
          <Button variant="success" onClick={addColumn}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
