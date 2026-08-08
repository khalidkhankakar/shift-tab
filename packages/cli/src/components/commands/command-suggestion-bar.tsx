import { TextAttributes } from "@opentui/core"

const ALL_COMMANDS = [
    {
        name: '/new',
        description: 'start a new conversation'
    },
    {

        name: '/model',
        description: 'select a AI model'
    },
    {
        name: '/clear',
        description: 'clear the terminal and start a new chat'
    },
    {
        name: '/delete',
        description: 'delete the perminality this session and exit'
    },
    {
        name: '/copy',
        description: 'copy the last agent response'
    },
    {
        name: '/exit',
        description: 'exit shift-tab'
    }
]


const CommandSuggestionBar = ({ query = "", onSelectCommand }: { query: string, onSelectCommand: (command: string) => void }) => {

    const filteredCommands = ALL_COMMANDS.filter((cmd) => cmd.name.toLowerCase().startsWith(query.toLowerCase()));

    if (filteredCommands.length === 0) {
        return (
            <box
                width={'100%'} backgroundColor={'gray'} padding={1} gap={1} position="absolute" bottom={5}   >
                <text attributes={TextAttributes.BOLD}>No matching commmands</text>
            </box>
        )
    }




    return (
        <box
            width={'100%'} backgroundColor={'#0b0c1b'} position="absolute" bottom={5}   >
            <select
                height={10}
                options={filteredCommands}
                onChange={(idx, option) => {
                    if (!option) return;
                    onSelectCommand(option.name)
                }}
                padding={1}
            />
        </box>
    )
}

export default CommandSuggestionBar
