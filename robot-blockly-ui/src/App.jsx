import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";


Blockly.Blocks["robot_start"] = {
  init: function () {
    this.appendDummyInput().appendField("START PROGRAM");

    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Start the robot program.");
  },
};

Blockly.Blocks["robot_move_forward"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("move forward")
      .appendField(new Blockly.FieldNumber(10, 0), "DISTANCE")
      .appendField("cm");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Move the robot forward by a given distance.");
  },
};

Blockly.Blocks["robot_move_backward"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("move backward")
      .appendField(new Blockly.FieldNumber(10, 0), "DISTANCE")
      .appendField("cm");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Move the robot backward by a given distance.");
  },
};

Blockly.Blocks["robot_set_speed"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("set speed")
      .appendField(new Blockly.FieldNumber(50, 0, 100), "SPEED")
      .appendField("%");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Set the robot speed percentage.");
  },
};

Blockly.Blocks["robot_wait"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("wait")
      .appendField(new Blockly.FieldNumber(1, 0), "SECONDS")
      .appendField("seconds");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip("Pause the robot for a given number of seconds.");
  },
};

Blockly.Blocks["robot_turn_right"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("turn right")
      .appendField(new Blockly.FieldNumber(90, 0, 360), "ANGLE")
      .appendField("degrees");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Turn the robot right by a given angle.");
  },
};

Blockly.Blocks["robot_turn_left"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("turn left")
      .appendField(new Blockly.FieldNumber(90, 0, 360), "ANGLE")
      .appendField("degrees");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Turn the robot left by a given angle.");
  },
};

Blockly.Blocks["robot_stop"] = {
  init: function () {
    this.appendDummyInput().appendField("stop robot");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("Stop the robot.");
  },
};


function App() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [commandsOutput, setCommandsOutput] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
    

  useEffect(() => {
    const toolbox = {
      kind: "categoryToolbox",
      contents: [
        {
          kind: "category",
          name: "Motion",
          colour: "#4CAF50",
          contents: [
        {
          kind: "block",
          type: "robot_start",
        },
        {
          kind: "block",
          type: "robot_move_forward",
        },
        {
          kind: "block",
          type: "robot_move_backward",
        },
        {
          kind: "block",
          type: "robot_set_speed",
        },
        {
          kind: "block",
          type: "robot_turn_left",
        },
        {
          kind: "block",
          type: "robot_turn_right",
        },
        {
          kind: "block",
          type: "robot_stop",
        },
          ],
        },

        {
          kind: "category",
          name: "Timing",
          colour: "#FF9800",
          contents: [
            {
              kind: "block",
              type: "robot_wait",
            },
          ],
        },

        {
          kind: "category",
          name: "Logic",
          colour: "#9C27B0",
          contents: [
        {
          kind: "block",
          type: "controls_repeat_ext",
        },
        {
          kind: "block",
          type: "logic_compare",
        },
      ],
    },

    {
      kind: "category",
      name: "Math",
      colour: "#2196F3",
      contents: [
        {
          kind: "block",
          type: "math_number",
        },
      ],
    },
  ],
};

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox,
      trashcan: true,
    });
    workspaceRef.current = workspace;

    const enforceSingleStartProgramBlock = (event) => {
      if (event.type !== Blockly.Events.BLOCK_CREATE) {
        return;
      }

      const startBlocks = workspace.getBlocksByType("robot_start", false);
      if (startBlocks.length <= 1) {
        return;
      }

      const createdStartBlock = event.ids
        ?.map((id) => workspace.getBlockById(id))
        .find((block) => block?.type === "robot_start");
      const duplicateBlock = createdStartBlock ?? startBlocks[startBlocks.length - 1];

      if (duplicateBlock) {
        Blockly.Events.disable();
        duplicateBlock.dispose(false);
        Blockly.Events.enable();
        setWarningMessage("Only one START PROGRAM block is allowed.");
      }
    };

    workspace.addChangeListener(enforceSingleStartProgramBlock);

    return () => {
      workspace.removeChangeListener(enforceSingleStartProgramBlock);
      workspace.dispose();
    };
  }, []);

  const buildCommands = () => {
    const topBlocks = workspaceRef.current.getTopBlocks(true);
    const commands = [];

    const readBlockChain = (block) => {
    let currentBlock = block;

    while (currentBlock) {
      if (currentBlock.type === "robot_move_forward") {
        commands.push({
          command: "move_forward",
          distance: Number(currentBlock.getFieldValue("DISTANCE")),
          unit: "cm",
        });
      }

      if (currentBlock.type === "robot_move_backward") {
        commands.push({
          command: "move_backward",
          distance: Number(currentBlock.getFieldValue("DISTANCE")),
          unit: "cm",
        });
      }

      if (currentBlock.type === "robot_set_speed") {
        commands.push({
          command: "set_speed",
          speed: Number(currentBlock.getFieldValue("SPEED")),
          unit: "percent",
        });
      }

      if (currentBlock.type === "robot_turn_left") {
        commands.push({
          command: "turn_left",
          angle: Number(currentBlock.getFieldValue("ANGLE")),
          unit: "degrees",
        });
      }

      if (currentBlock.type === "robot_turn_right") {
        commands.push({
          command: "turn_right",
          angle: Number(currentBlock.getFieldValue("ANGLE")),
          unit: "degrees",
        });
      }

      if (currentBlock.type === "robot_wait") {
        commands.push({
          command: "wait",
          duration: Number(currentBlock.getFieldValue("SECONDS")),
          unit: "seconds",
        });
      }

      if (currentBlock.type === "robot_stop") {
        commands.push({
          command: "stop",
        });
      }

      currentBlock = currentBlock.getNextBlock();
    }
  };

  topBlocks.forEach(readBlockChain);
  return commands;
};

const getStartProgramBlocks = () => {
  return workspaceRef.current.getBlocksByType("robot_start", false);
};

const validateProgram = () => {
  const startBlocks = getStartProgramBlocks();

  if (startBlocks.length === 0) {
    setWarningMessage("Add a START PROGRAM block before generating commands.");
    setCommandsOutput([]);
    return false;
  }

  if (startBlocks.length > 1) {
    setWarningMessage("Only one START PROGRAM block is allowed.");
    setCommandsOutput([]);
    return false;
  }

  setWarningMessage("");
  return true;
};

const generateCommands = () => {
  if (!validateProgram()) {
    return;
  }

  const commands = buildCommands();
  setCommandsOutput(commands);
};

const runProgram = () => {
  if (!validateProgram()) {
    return;
  }

  const commands = buildCommands();
  setCommandsOutput(commands);

  console.log("Sending commands to robot:", commands);
  // TODO: Send commands to robot via API or WebSocket
  // Example API call:
  // fetch('/api/robot/commands', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(commands)
  // })
  // For now, just show in console

  alert("Program sent to robot. Check console for now.");
};

const emergencyStop = () => {
  const command = {
    command: "emergency_stop",
  };

  setWarningMessage("Emergency stop command sent.");
  setCommandsOutput([command]);
  console.log("Sending emergency stop to robot:", command);
  // TODO: Send emergency stop to robot via API or WebSocket
};

  return (
  <div style={{ height: "100vh", width: "100vw" }}>
    <div
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        background: "#1f2937",
      }}
    >
      <button onClick={generateCommands}>Generate Commands</button>
      <button onClick={runProgram}>Run Program</button>
      <button
        onClick={emergencyStop}
        style={{
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontWeight: 700,
          padding: "8px 12px",
        }}
      >
        Emergency Stop
      </button>
      <button onClick={() => {
        workspaceRef.current.clear();
        setWarningMessage("");
        setCommandsOutput([]);
      }}>Clear</button>
      {warningMessage && (
        <span
          style={{
            color: "#fecaca",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {warningMessage}
        </span>
      )}
    </div>

    <div style={{ display: "flex", height: "calc(100% - 60px)" }}>
      <div
        ref={blocklyDiv}
        style={{ height: "100%", width: "70%" }}
      />

      <pre
        style={{
          width: "30%",
          margin: 0,
          padding: "15px",
          background: "#111827",
          color: "white",
          overflow: "auto",
          fontSize: "14px",
        }}
      >
        {JSON.stringify(commandsOutput, null, 2)}
      </pre>
    </div>
  </div>
);
}

export default App;
