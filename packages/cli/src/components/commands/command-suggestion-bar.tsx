import { TextAttributes } from "@opentui/core"

const ALL_COMMANDS = [
    {
        name: '/new',
        description: 'start a new conversation',
        execute: () => {}
    },
    {

        name: '/model',
        description: 'select a AI model',
        execute: () => {}   
    },
    {
        name: '/clear',
        description: 'clear the terminal and start a new chat',
        execute: () => {}

    },
    {
        name: '/delete',
        description: 'delete the perminality this session and exit',
        execute: () => {}

    },
    {
        name: '/copy',
        description: 'copy the last agent response',
        execute: () => {}

    },
    {
        name: '/exit',
        description: 'exit shift-tab',
        execute: () => {}

    }
]


const CommandSuggestionBar = ({ query = "", onSelectCommand }: { query: string, onSelectCommand: (command: string) => void }) => {

    const filteredCommands = ALL_COMMANDS.filter((cmd) => cmd.name.toLowerCase().startsWith(query.toLowerCase()));

    if(filteredCommands.length <= 0) return null;



    return (
        <box
            width={'100%'} backgroundColor={'#0b0c1b'} position="absolute" bottom={5}   >
            <select
                height={10}
                options={filteredCommands}
                onSelect={(idx, option) => {
                  if (option) onSelectCommand(option.name)
                }}
                padding={1}
            />
        </box>
    )
}

export default CommandSuggestionBar
