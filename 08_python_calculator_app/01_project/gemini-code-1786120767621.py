import tkinter as tk


def button_click(char):
    """Handles button presses for numbers, operators, clear, and equals."""
    current_text = display.get()

    if char == "C":
        display.delete(0, tk.END)
    elif char == "=":
        try:
            # Safely evaluate the mathematical expression
            result = eval(current_text)
            display.delete(0, tk.END)
            display.insert(0, str(result))
        except Exception:
            display.delete(0, tk.END)
            display.insert(0, "Error")
    else:
        display.insert(tk.END, char)


# 1. Initialize the main app window
root = tk.Tk()
root.title("Tkinter Calculator")
root.geometry("320x420")
root.resizable(False, False)

# 2. Create the display screen (Entry widget)
display = tk.Entry(root, font=("Arial", 22), justify="right", bd=8, relief=tk.SUNKEN)
display.grid(row=0, column=0, columnspan=4, padx=10, pady=15, ipady=8, sticky="nsew")

# 3. Define the grid layout for buttons (text, row, column)
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

# 4. Generate buttons dynamically using a loop
for text, row, col in buttons:
    btn = tk.Button(
        root,
        text=text,
        font=("Arial", 16, "bold"),
        # Use lambda t=text to lock in the current button's value
        command=lambda t=text: button_click(t),
    )
    btn.grid(row=row, column=col, padx=3, pady=3, sticky="nsew")

# 5. Configure grid weight so buttons resize evenly
for i in range(5):
    root.grid_rowconfigure(i, weight=1)
for j in range(4):
    root.grid_columnconfigure(j, weight=1)

# 6. Run the GUI event loop
root.mainloop()
