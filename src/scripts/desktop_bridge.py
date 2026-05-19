import sys
import json
import base64
import io
import os
import subprocess
from datetime import datetime

import mss
import pyautogui
import pygetwindow as gw

SCREENSHOT_DIR = None

def handle_command(cmd):
    action = cmd.get('action', '')
    
    if action == 'ping':
        return {'status': 'ok', 'time': datetime.now().isoformat()}
    
    elif action == 'screenshot':
        with mss.mss() as s:
            mon = cmd.get('monitor', 1)
            monitors = s.monitors
            if mon < 1 or mon >= len(monitors):
                mon = 1
            shot = s.grab(monitors[mon])
            img_bytes = mss.tools.to_png(shot.rgb, shot.size)
            b64 = base64.b64encode(img_bytes).decode('utf-8')
            result = {
                'status': 'ok',
                'width': shot.size[0],
                'height': shot.size[1],
                'format': 'png',
                'data': b64
            }
            if SCREENSHOT_DIR:
                ts = datetime.now().strftime('%Y%m%d_%H%M%S')
                fpath = os.path.join(SCREENSHOT_DIR, f'screenshot_{ts}.png')
                with open(fpath, 'wb') as f:
                    f.write(img_bytes)
                result['file'] = fpath
            return result
    
    elif action == 'windows':
        wins = gw.getWindowsWithTitle('')
        result = []
        for w in wins:
            if w.title.strip():
                result.append({
                    'title': w.title,
                    'left': w.left, 'top': w.top,
                    'width': w.width, 'height': w.height,
                    'visible': w.visible,
                    'isActive': w.isActive,
                    'isMaximized': w.isMaximized,
                    'isMinimized': w.isMinimized
                })
        return {'status': 'ok', 'windows': result}
    
    elif action == 'mouse_move':
        x = cmd.get('x', 0)
        y = cmd.get('y', 0)
        duration = cmd.get('duration', 0.2)
        pyautogui.moveTo(x, y, duration=duration)
        return {'status': 'ok', 'x': x, 'y': y}
    
    elif action == 'click':
        x = cmd.get('x')
        y = cmd.get('y')
        button = cmd.get('button', 'left')
        clicks = cmd.get('clicks', 1)
        if x is not None and y is not None:
            pyautogui.click(x, y, clicks=clicks, button=button)
        else:
            pyautogui.click(clicks=clicks, button=button)
        return {'status': 'ok', 'x': x, 'y': y, 'button': button, 'clicks': clicks}
    
    elif action == 'double_click':
        x = cmd.get('x')
        y = cmd.get('y')
        if x is not None and y is not None:
            pyautogui.doubleClick(x, y)
        else:
            pyautogui.doubleClick()
        return {'status': 'ok', 'x': x, 'y': y}
    
    elif action == 'right_click':
        x = cmd.get('x')
        y = cmd.get('y')
        if x is not None and y is not None:
            pyautogui.rightClick(x, y)
        else:
            pyautogui.rightClick()
        return {'status': 'ok', 'x': x, 'y': y}
    
    elif action == 'type':
        text = cmd.get('text', '')
        interval = cmd.get('interval', 0.05)
        pyautogui.write(text, interval=interval)
        return {'status': 'ok', 'chars': len(text)}
    
    elif action == 'keypress':
        key = cmd.get('key', 'enter')
        pyautogui.press(key)
        return {'status': 'ok', 'key': key}
    
    elif action == 'hotkey':
        keys = cmd.get('keys', [])
        if keys:
            pyautogui.hotkey(*keys)
        return {'status': 'ok', 'keys': keys}
    
    elif action == 'scroll':
        clicks = cmd.get('clicks', 1)
        x = cmd.get('x')
        y = cmd.get('y')
        if x is not None and y is not None:
            pyautogui.scroll(clicks, x=x, y=y)
        else:
            pyautogui.scroll(clicks)
        return {'status': 'ok', 'clicks': clicks}
    
    elif action == 'drag':
        start_x = cmd.get('start_x', 0)
        start_y = cmd.get('start_y', 0)
        end_x = cmd.get('end_x', 0)
        end_y = cmd.get('end_y', 0)
        duration = cmd.get('duration', 0.5)
        pyautogui.moveTo(start_x, start_y)
        pyautogui.drag(end_x - start_x, end_y - start_y, duration=duration)
        return {'status': 'ok'}
    
    elif action == 'position':
        x, y = pyautogui.position()
        return {'status': 'ok', 'x': x, 'y': y}
    
    elif action == 'screen_size':
        w, h = pyautogui.size()
        return {'status': 'ok', 'width': w, 'height': h}
    
    elif action == 'activate_window':
        title = cmd.get('title', '')
        wins = gw.getWindowsWithTitle(title)
        if wins:
            try:
                wins[0].activate()
                return {'status': 'ok', 'title': wins[0].title}
            except Exception as e:
                return {'status': 'error', 'message': str(e)}
        return {'status': 'error', 'message': f'Window not found: {title}'}
    
    elif action == 'launch':
        app = cmd.get('app', '')
        try:
            if sys.platform == 'win32':
                os.startfile(app)
            else:
                subprocess.Popen([app], shell=True)
            return {'status': 'ok', 'app': app}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    elif action == 'get_active_window':
        active = gw.getActiveWindow()
        if active:
            return {'status': 'ok', 'title': active.title, 'left': active.left, 'top': active.top, 'width': active.width, 'height': active.height}
        return {'status': 'ok', 'title': None}
    
    else:
        return {'status': 'error', 'message': f'Unknown action: {action}'}


def main():
    global SCREENSHOT_DIR
    
    if len(sys.argv) > 1:
        SCREENSHOT_DIR = sys.argv[1]
        os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    
    pyautogui.FAILSAFE = True
    pyautogui.PAUSE = 0.1
    
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            cmd = json.loads(line)
            result = handle_command(cmd)
            sys.stdout.write(json.dumps(result) + '\n')
            sys.stdout.flush()
        except json.JSONDecodeError as e:
            sys.stdout.write(json.dumps({'status': 'error', 'message': f'Invalid JSON: {e}'}) + '\n')
            sys.stdout.flush()
        except Exception as e:
            sys.stdout.write(json.dumps({'status': 'error', 'message': str(e)}) + '\n')
            sys.stdout.flush()


if __name__ == '__main__':
    main()
