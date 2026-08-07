import tkinter as tk


def button_click(char):
    """Handles calculator logic for clicks and keypresses."""
    current_text = display.get()

    if char == "C":
        display.delete(0, tk.END)
    elif char == "=":
        try:
            result = eval(current_text)
            display.delete(0, tk.END)
            display.insert(0, str(result))
        except Exception:
            display.delete(0, tk.END)
            display.insert(0, "Error")
    elif char == "Backspace":
        # Remove the last character on the display
        display.delete(len(current_text) - 1, tk.END)
    else:
        display.insert(tk.END, char)


def key_handler(event):
    """Maps physical keypresses to calculator actions."""
    char = event.char
    key = event.keysym

    # Digits and operators
    if char in "0123456789+-*/.":
        button_click(char)
    # Evaluate result on 'Enter' or '='
    elif key in ("Return", "KP_Enter") or char == "=":
        button_click("=")
    # Delete single character on 'Backspace'
    elif key == "BackSpace":
        button_click("Backspace")
    # Clear screen on 'Escape' or 'c' / 'C'
    elif key == "Escape" or char.lower() == "c":
        button_click("C")


# 1. Initialize the main window
root = tk.Tk()
root.title("Tkinter Calculator")
root.geometry("320x420")
root.resizable(False, False)

# 2. Bind keyboard events to the main window
root.bind("<Key>", key_handler)

# 3. Create the display screen
display = tk.Entry(root, font=("Arial", 22), justify="right", bd=8, relief=tk.SUNKEN)
display.grid(row=0, column=0, columnspan=4, padx=10, pady=15, ipady=8, sticky="nsew")

# 4. Define buttons
buttons = [
    ("7", 1, 0),
    ("8", 1, 1),
    ("9", 1, 2),
    ("/", 1, 3),
    ("4", 2, 0),
    ("5", 2, 1),
    ("6", 2, 2),
    ("*", 2, 3),
    ("1", 3, 0),
    ("2", 3, 1),
    ("3", 3, 2),
    ("-", 3, 3),
    ("C", 4, 0),
    ("0", 4, 1),
    ("=", 4, 2),
    ("+", 4, 3),
]

# 5. Build buttons using loop
for text, row, col in buttons:
    btn = tk.Button(
        root,
        text=text,
        font=("Arial", 16, "bold"),
        command=lambda t=text: button_click(t),
    )
    btn.grid(row=row, column=col, padx=3, pady=3, sticky="nsew")

# 6. Configure grid scaling
for i in range(5):
    root.grid_rowconfigure(i, weight=1)
for j in range(4):
    root.grid_columnconfigure(j, weight=1)

# 7. Start app
root.mainloop()
