import { useEffect, useState, useLayoutEffect } from "react";
import rough from "roughjs";
// import { Socket } from "socket.io-client";

const roughGenerator = rough.generator();

const WhiteBoard = ({canvasRef, ctxRef, elements, setElements, tool, color,user,handleClearCanvas,socket}) => {

    
    const [img, setImg] = useState(null);

    useEffect(() => {
      socket.on("whiteBoardDataResponse", (data) => {
        setImg(data.imgURL);
        console.log("Received imgURL from server:", data.imgURL);
      });
      socket.off("whiteBoardDataResponse")
    }, [socket]);
    if (!user?.presenter) {
      return (
        <div className="border border-dark border-3 h-100 w-100 overflow-hidden">
        {img && (
          <img
            src={img}
            alt="Real time white "
            style={{
              height: window.innerHeight * 2,
              width: "285%",
            }}
          />
        )}
        </div>
      );
    }
    useEffect(()=>{
      socket.on("drawing", (newElement) => {
        console.log("New Element Received:", newElement);
        setElements((prevElements) => [...prevElements, newElement]);
    });

    })
    useEffect(()=>{
        console.log(canvasRef,ctxRef)
        const canvas = canvasRef.current
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        const ctx = canvas.getContext("2d")
        ctxRef.current = ctx
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctxRef.current = ctx;
    },[])

    useEffect(() => {
        ctxRef.current.strokeStyle = color;
        console.log("user",user)
      }, [color]);
      

    const [isDrawing, setIsDrawing] = useState(false);

    useLayoutEffect(()=>{
        
      const roughCanvas = rough.canvas(canvasRef.current);
      
        if (elements.length > 0) {
            ctxRef.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
            );
        }
        elements.forEach((element) => {
            if (element.type === "rect") {
              roughCanvas.draw(
                roughGenerator.rectangle(
                  element.offsetX,
                  element.offsetY,
                  element.width,
                  element.height,
                  {
                    stroke: element.stroke,
                    strokeWidth: 5,
                    roughness: 0,
                  }
                )
              );
            } else if (element.type === "line") {
              roughCanvas.draw(
                roughGenerator.line(
                  element.offsetX,
                  element.offsetY,
                  element.width,
                  element.height,
                  {
                    stroke: element.stroke,
                    strokeWidth: 5,
                    roughness: 0,
                  }
                )
              );
            } else if (element.type === "pencil") {
              roughCanvas.linearPath(element.path, {
                stroke: element.stroke,
                strokeWidth: 5,
                roughness: 0,
              });
            }
          });
          const canvasImage = canvasRef.current.toDataURL();
          socket.emit("whiteboardData", {canvasImage:canvasImage, elements:elements, roomId:user.roomId});
          console.log("emitting data")
          
    },[elements])

    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        console.log({tool})
        if (tool === "pencil") {
            setElements((prevElements) => [
              ...prevElements,
              {
                type: "pencil",
                offsetX,
                offsetY,
                path: [[offsetX, offsetY]],
                stroke: color,
              },
            ]);
          } else if (tool === "line") {
            setElements((prevElements) => [
              ...prevElements,
              {
                type: "line",
                offsetX,
                offsetY,
                width: offsetX,
                height: offsetY,
                stroke: color,
              },
            ]);
          } else if (tool === "rect") {
            setElements((prevElements) => [
              ...prevElements,
              {
                type: "rect",
                offsetX,
                offsetY,
                width: 0,
                height: 0,
                stroke: color,
              },
            ]);
          }
      
          setIsDrawing(true);
      };

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (isDrawing) {
          
          if (tool === "pencil") {
            const { path } = elements[elements.length - 1];
            const newPath = [...path, [offsetX, offsetY]];
            setElements((prevElements) =>
              prevElements.map((ele, index) => {
                if (index === elements.length - 1) {
                  return {
                    ...ele,
                    path: newPath,
                  };
                } else {
                  return ele;
                }
              })
            );
          } else if (tool === "line") {
            setElements((prevElements) =>
              prevElements.map((ele, index) => {
                if (index === elements.length - 1) {
                  return {
                    ...ele,
                    width: offsetX,
                    height: offsetY,
                  };
                } else {
                  return ele;
                }
              })
            );
          } else if (tool === "rect") {
            setElements((prevElements) =>
              prevElements.map((ele, index) => {
                if (index === elements.length - 1) {
                  return {
                    ...ele,
                    width: offsetX - ele.offsetX,
                    height: offsetY - ele.offsetY,
                  };
                } else {
                  return ele;
                }
              })
            );
          }
        }
    };

    const handleMouseUp = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setIsDrawing(false)
      };
    return (
        <div 
          onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className='border border-dark border-3 h-100 w-100 overflow-hidden'>
            <canvas ref={canvasRef} />
        </div>
        

    )
}

export default WhiteBoard